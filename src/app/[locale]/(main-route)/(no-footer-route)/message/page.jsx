"use client";

import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ConversationList } from "@/components/message/ConversationList";
import { MessagePanel } from "@/components/message/MessagePanel";
import { MediaPanel } from "@/components/message/MediaPanel";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { fakeMediaByConversation } from "@/components/message/data";

import { Skeleton } from "@/components/ui/skeleton";
import LoadFailed from "@/components/common/LoadFailed";
import { useSocket } from '@/context/soket-context/SocketContext';
import { useGetSingleConversationQuery } from "@/lib/features/api/chatApi";
import { baseApi } from "@/lib/features/api/baseApi";

import MessagePanelSkeleton from "@/components/skeleton/MessagePanelSkeleton";
import { useGetMe } from '@/hooks/useGetMe';
import { useTransformMessage } from '@/hooks/useTransformMessage';
import { useConversationsList } from '@/hooks/useConversationsList';

const MessagePage = () => {
    const { socket, sendMessage } = useSocket();
    const dispatch = useDispatch();
    const { profile } = useGetMe();
    const me = profile.data;
    const transformMessage = useTransformMessage(me || {});

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const { conversations, isLoading: isChatListLoading, isError: isChatListError } = useConversationsList(searchTerm);



    const [activeConversation, setActiveConversation] = useState(null);
    const [isMediaSheetOpen, setIsMediaSheetOpen] = useState(false);

    // Single Conversation
    const singleConversationQueryParams = useMemo(() => {
        console.log("Calculating singleConversationQueryParams:", activeConversation);
        if (!activeConversation) return null;

        const params = { page, limit };
        switch (activeConversation.subtype) {
            case 'oneToOne':
                params.userId = activeConversation.userId;
                break;
            case 'chatGroup':
                params.chatGroupId = activeConversation.chatGroupId;
                break;
            case 'bondLink':
                params.bondLinkId = activeConversation.bondLinkId;
                break;
            case 'project':
                params.projectId = activeConversation.projectId;
                break;
            default:
                return null;
        }

        const hasId = params.userId || params.chatGroupId || params.bondLinkId || params.projectId;
        return hasId ? params : null;

    }, [activeConversation, page, limit]);

    // Single Conversation
    const { data: messagesData, isLoading: isMessagesLoading, isError: isMessagesError } = useGetSingleConversationQuery(
        singleConversationQueryParams,
        {
            skip: !singleConversationQueryParams,
        }
    );

    const handleConversationClick = (conv) => {
        setActiveConversation(conv);
    };


    const handleBack = () => {
        setActiveConversation(null);
    };

    const fetchMoreMessages = () => {
        if (!isMessagesLoading && messagesData?.data?.meta?.totalPage > page) {
            setPage(prevPage => prevPage + 1);
        }
    };



    const handleSendMessage = () => {
        if (newMessage.trim() && activeConversation) {
            const payload = {
                text: newMessage,
            };
            const tempMessage = transformMessage({
                _id: `temp-${Date.now()}`,
                text: newMessage,
                createdAt: new Date().toISOString(),
                msgByUserId: me?._id ? { _id: me._id, name: me.name, profile_image: me.profile_image } : undefined,
            });
            setMessages(prev => [...prev, tempMessage]);

            switch (activeConversation.subtype) {
                case 'oneToOne':
                    payload.receiver = activeConversation.userId;
                    break;
                case 'chatGroup':
                    payload.groupId = activeConversation.chatGroupId;
                    break;
                case 'bondLink':
                    payload.bondLinkId = activeConversation.bondLinkId;
                    break;
                case 'project':
                    payload.projectId = activeConversation.projectId;
                    break;
                default:
                    console.warn("Unknown conversation subtype for sending message:", activeConversation.subtype, activeConversation);
                    return;
            }
            sendMessage(payload);
            dispatch(baseApi.util.invalidateTags(['CONVERSATIONS'])); // Invalidate cache after sending message

            setNewMessage('');
        }
    };

    useEffect(() => {
        if (messagesData?.data?.result) {
            const { result, meta } = messagesData.data;
            const transformedMessages = result.map(transformMessage) || [];
            transformedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            setMessages(prevMessages => {
                let combinedMessages;
                if (meta.page === 1) {
                    combinedMessages = transformedMessages;
                } else {
                    combinedMessages = [...transformedMessages, ...prevMessages];
                }

                const messageMap = new Map();
                combinedMessages.forEach(msg => {
                    messageMap.set(msg.id, msg);
                });

                const uniqueMessages = Array.from(messageMap.values());
                uniqueMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                return uniqueMessages;
            });
        }
    }, [messagesData, page, limit, transformMessage]);

    useEffect(() => {
        setPage(1);
    }, [activeConversation]);

    useEffect(() => {
        if (!socket || !activeConversation) return;

        let eventName = '';
        if (activeConversation.type === 'one-two-one') {
            eventName = `message-${activeConversation.userId}`;
        } else if (activeConversation.type === 'chat-group') {
            eventName = `message-${activeConversation.chatGroupId}`;
        } else if (activeConversation.type === 'bond-link-group') {
            eventName = `message-${activeConversation.bondLinkId}`;
        } else if (activeConversation.type === 'project-group') {
            eventName = `message-${activeConversation.projectId}`;
        }

        if (eventName) {
            const messageHandler = (msg) => {
                setMessages((prevMessages) => {
                    const transformedMsg = transformMessage(msg);
                    // Check if this message is one that we sent and stored temporarily
                    const tempMsgIndex = prevMessages.findIndex(
                        m => m.msgByUserId?._id === me?._id && m.text === transformedMsg.text && m.id.toString().startsWith('temp-')
                    );

                    if (tempMsgIndex !== -1) {
                        // Replace the temporary message with the real one from the server
                        const newMessages = [...prevMessages];
                        newMessages[tempMsgIndex] = transformedMsg;
                        return newMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    }

                    const exists = prevMessages.some(m => m.id === transformedMsg.id);
                    if (!exists) {
                        return [...prevMessages, transformedMsg].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    }
                    return prevMessages;
                });
                dispatch(baseApi.util.invalidateTags(['CONVERSATIONS'])); // Invalidate cache on message receipt
            };

            socket.on(eventName, messageHandler);

            return () => {
                socket.off(eventName, messageHandler);
            };
        }
    }, [socket, activeConversation, transformMessage, me, dispatch]);

    useEffect(() => {
        console.log("Attempting to set up generic message listener. Socket:", !!socket);
        if (!socket) return;

        const handleGenericMessage = (msg) => {
            console.log("Received generic message:", msg);
            // If the message is for the currently active conversation, it will be handled by the specific eventName listener
            if (activeConversation && (
                (activeConversation.type === 'one-two-one' && activeConversation.userId === msg.msgByUserId?._id) ||
                (activeConversation.type === 'chat-group' && activeConversation.chatGroupId === msg.chatGroupId) ||
                (activeConversation.type === 'bondLink' && activeConversation.bondLinkId === msg.bondLinkId) ||
                (activeConversation.type === 'project' && activeConversation.projectId === msg.projectId)
            )) {
                // This case should ideally be handled by the specific eventName listener, but as a fallback/double check
                setMessages((prevMessages) => {
                    const transformedMsg = transformMessage(msg);
                    const tempMsgIndex = prevMessages.findIndex(
                        m => m.msgByUserId?._id === me?._id && m.text === transformedMsg.text && m.id.toString().startsWith('temp-')
                    );

                    if (tempMsgIndex !== -1) {
                        const newMessages = [...prevMessages];
                        newMessages[tempMsgIndex] = transformedMsg;
                        return newMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    }

                    const exists = prevMessages.some(m => m.id === transformedMsg.id);
                    if (!exists) {
                        return [...prevMessages, transformedMsg].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    }
                    return prevMessages;
                });
            }

            // Invalidate chat list to update last message and order
            dispatch(baseApi.util.invalidateQueries(['getChatList']));
        };

        socket.on("message", handleGenericMessage);

        return () => {
            socket.off("message", handleGenericMessage);
        };
    }, [socket, activeConversation, dispatch, transformMessage, me]);

    useEffect(() => {
        if (!socket) return;
        const handleConversationUpdate = (newConvData) => {
            dispatch(baseApi.util.updateQueryData('getChatList', { searchTerm: '' }, (draft) => {
                if (!draft.data) {
                    draft.data = {};
                }
                if (!draft.data.data) {
                    draft.data.data = [];
                }

                if (!newConvData || !newConvData._id) {
                    console.warn("Received invalid conversation data from socket:", newConvData);
                    return;
                }

                const existingConvIndex = draft.data.data.findIndex(
                    (conv) => conv._id === newConvData._id
                );

                if (existingConvIndex !== -1) {
                    draft.data.data[existingConvIndex].lastMessage = newConvData.lastMessage;
                    draft.data.data[existingConvIndex].updated_at = newConvData.updated_at || newConvData.lastMessage?.updatedAt;
                    draft.data.data[existingConvIndex].unseenMsg = newConvData.unseenMsg;
                    const updatedConv = draft.data.data.splice(existingConvIndex, 1)[0];
                    draft.data.data.unshift(updatedConv);

                } else {
                    const newConversation = { ...newConvData };
                    newConversation.updated_at = newConvData.updated_at || newConvData.lastMessage?.updatedAt || new Date().toISOString();
                    draft.data.data.unshift(newConversation);
                }
                draft.data.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            }));
        };

        socket.on("conversation", handleConversationUpdate);

        return () => {
            socket.off("conversation", handleConversationUpdate);
        };
    }, [socket, dispatch]);


    const onOpenMediaSheet = () => {
        setIsMediaSheetOpen(true);
    };

    if (isChatListLoading) {
        return (
            <div className="h-[calc(100vh-80px)] w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
            </div>
        );
    }


    if (isChatListLoading) {
        return (
            <div className="h-[calc(100vh-80px)] w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
            </div>
        );
    }

    if (isChatListError) {
        return (
            <div className="h-[calc(100vh-80px)] w-full flex items-center justify-center">
                <LoadFailed msg="Failed to load conversations." />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-80px)] w-full">
            <div className="flex h-full bg-card border rounded-lg">
                {/* Mobile View */}
                <div className="w-full lg:hidden">
                    {!activeConversation ? (
                        <ConversationList
                            conversations={conversations}
                            activeConversation={activeConversation}
                            onConversationClick={handleConversationClick}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm} />
                    ) : (
                        isMessagesLoading ? (
                            <MessagePanelSkeleton />
                        ) : isMessagesError ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <LoadFailed msg="Failed to load messages." />
                            </div>
                        ) : (
                            <MessagePanel
                                conversation={activeConversation}
                                messages={messages}
                                onBack={handleBack}
                                fetchMoreMessages={fetchMoreMessages}
                                isMessagesLoading={isMessagesLoading}
                                onOpenMedia={onOpenMediaSheet}
                                newMessage={newMessage}
                                setNewMessage={setNewMessage}
                                onSendMessage={handleSendMessage}
                            />
                        ))}
                </div>

                {/* Desktop View */}
                <div className="hidden lg:flex w-full">
                    <div className="w-1/3 xl:w-1/4 border-r">
                        <ConversationList
                            conversations={conversations}
                            activeConversation={activeConversation}
                            onConversationClick={handleConversationClick}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm} />
                    </div>
                    <div className="w-2/3 xl:w-1/2">
                        {activeConversation ? (
                            isMessagesLoading ? (
                                <MessagePanelSkeleton />
                            ) : isMessagesError ? (
                                <div className="h-full w-full flex items-center justify-center">
                                    <LoadFailed msg="Failed to load messages." />
                                </div>
                            ) : (
                                <MessagePanel
                                    conversation={activeConversation}
                                    messages={messages}
                                    onBack={handleBack}
                                    fetchMoreMessages={fetchMoreMessages}
                                    isMessagesLoading={isMessagesLoading}
                                    newMessage={newMessage}
                                    setNewMessage={setNewMessage}
                                    onSendMessage={handleSendMessage}
                                />
                            )
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground"><p>Select a conversation to start chatting.</p></div>
                        )}
                    </div>
                    <div className="hidden xl:flex w-1/4 border-l">
                        <MediaPanel media={activeConversation ? fakeMediaByConversation[activeConversation.id] : []} />
                    </div>
                </div>

                <Sheet open={isMediaSheetOpen} onOpenChange={setIsMediaSheetOpen}>
                    <SheetContent side="right" className="p-0 w-full sm:w-96">
                        <SheetHeader className="p-4 border-b">
                            <SheetTitle>Media and files</SheetTitle>
                            <SheetDescription>Media and files shared in this conversation.</SheetDescription>
                        </SheetHeader>
                        <MediaPanel media={activeConversation ? fakeMediaByConversation[activeConversation.id] : []} />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default MessagePage;