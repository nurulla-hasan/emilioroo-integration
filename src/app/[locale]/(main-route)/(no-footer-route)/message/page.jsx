"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ConversationList } from "@/components/message/ConversationList";
import { MessagePanel } from "@/components/message/MessagePanel";
import { MediaPanel } from "@/components/message/MediaPanel";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { fakeMediaByConversation } from "@/components/message/data";
import { useGetChatListQuery, useGetSingleConversationQuery } from "@/lib/features/api/chatApi";
import { Skeleton } from "@/components/ui/skeleton";
import LoadFailed from "@/components/common/LoadFailed";
import { fallbackAvatar, timeAgo } from "@/lib/utils";
import { useSocket } from '@/context/soket-context/SocketContext';

const MessagePage = () => {
    const { socket, sendMessage, sendSeen } = useSocket();

    const markAsSeen = useCallback((messageId) => {
        sendSeen({ messageId });
    }, [sendSeen]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(20); // Fetch 20 messages at a time

    const { data: chatListData, isLoading: isChatListLoading, isError: isChatListError } = useGetChatListQuery(
        {
            searchTerm
        }
    );

    const conversations = useMemo(() => {
        return chatListData?.data?.data?.map(conv => ({
            id: conv._id,
            conversationId: conv._id,
            userId: conv.userData._id,
            type: conv.type, // Add conversation type
            bondLinkId: conv.type === 'group' && conv.bondLink ? conv.bondLink._id : undefined, // Add bondLinkId for group type
            projectId: conv.type === 'project' && conv.project ? conv.project._id : undefined, // Add projectId for project type
            chatGroupId: conv.type === 'chatGroup' && conv.chatGroup ? conv.chatGroup._id : undefined, // Add chatGroupId for chatGroup type
            name: conv.type === 'group' ? conv.bondLink.name : conv.userData.name,
            avatar: conv.userData.profile_image || fallbackAvatar,
            lastMessage: conv.lastMessage?.text || 'No messages yet',
            time: timeAgo(conv.updated_at),
            online: false, // Not available in API
        })) || [];
    }, [chatListData]);

    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isMediaSheetOpen, setIsMediaSheetOpen] = useState(false);
    const initialConversationSet = useRef(false);

    const { data: messagesData, isLoading: isMessagesLoading, isError: isMessagesError } = useGetSingleConversationQuery(
        {
            userId: activeConversation?.userId,
            page,
            limit
        },
        {
            skip: !activeConversation?.userId,
        }
    );

    useEffect(() => {
        if (!socket || !activeConversation) return;

        let eventName = '';
        if (activeConversation.type === 'one-two-one') {
            eventName = `message-${activeConversation.userId}`;
        } else if (activeConversation.type === 'group' && activeConversation.bondLinkId) {
            eventName = `message-${activeConversation.bondLinkId}`;
        } else if (activeConversation.type === 'project' && activeConversation.projectId) {
            eventName = `message-${activeConversation.projectId}`;
        } else if (activeConversation.type === 'chatGroup' && activeConversation.chatGroupId) {
            eventName = `message-${activeConversation.chatGroupId}`;
        }

        if (eventName) {
            const handleNewMessage = (msg) => {
                setMessages((prevMessages) => {
                    const transformedMsg = transformMessage(msg);

                    const optimisticIndex = prevMessages.findIndex(m => m._id && typeof m._id === 'string' && m._id.startsWith('optimistic-'));

                    let newMessages;

                    if (optimisticIndex > -1) {
                        newMessages = [...prevMessages];
                        newMessages[optimisticIndex] = {
                            ...transformedMsg,
                            text: prevMessages[optimisticIndex].text,
                            isMyMessage: true,
                            sender: 'me',
                            avatar: prevMessages[optimisticIndex].avatar,
                            type: 'text'
                        };
                    } else {
                        const exists = prevMessages.some(m => m._id === transformedMsg.id);
                        if (!exists) {
                            newMessages = [...prevMessages, transformedMsg];
                        } else {
                            newMessages = [...prevMessages];
                        }
                    }

                    newMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    return newMessages;
                });
            };

            socket.on(eventName, handleNewMessage);

            return () => {
                socket.off(eventName, handleNewMessage);
            };
        }
    }, [socket, activeConversation]);

    useEffect(() => {
        if (!socket) return;

        // Listen for seen events
        socket.on("seen", (data) => {
            
        });

        return () => {
            socket.off("seen");
        };
    }, [socket])

    const transformMessage = (msg) => {
        const userDetails = msg.userDetails || msg.msgByUserId;

        return {
            ...msg,
            id: msg._id,
            text: msg.text,
            sender: msg.isMyMessage ? 'me' : (userDetails?.name || 'Unknown User'),
            avatar: userDetails?.profile_image || fallbackAvatar,
            time: timeAgo(msg.createdAt),
            type: 'text'
        };
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

            if (transformedMessages.length > 0) {
                const lastMessageId = transformedMessages[transformedMessages.length - 1].id;
                markAsSeen(lastMessageId);
            }
        }
    }, [messagesData, markAsSeen, page, limit]);

    useEffect(() => {
        if (conversations.length > 0 && !initialConversationSet.current) {
            setActiveConversation(conversations[0]);
            initialConversationSet.current = true;
        }
    }, [conversations]);

    // Reset page to 1 when activeConversation changes
    useEffect(() => {
        setPage(1);
    }, [activeConversation]);

    const handleConversationClick = (conv) => {
        setActiveConversation(conv);
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && activeConversation) {
            let payload = {
                text: newMessage,
                imageUrl: [],
                videoUrl: [],
            };

            switch (activeConversation.type) {
                case 'one-two-one':
                    payload.receiver = activeConversation.userId;
                    break;
                case 'group':
                    payload.bondLinkId = activeConversation.bondLinkId;
                    break;
                default:
                    console.warn("Unknown conversation type or missing ID for sending message:", activeConversation.type, activeConversation);
                    return; // Do not send message for unhandled types
            }

            sendMessage(payload);

            const tempId = `optimistic-${Date.now()}`;
            const newMsg = {
                _id: tempId,
                id: tempId,
                text: newMessage,
                sender: 'me',
                time: 'Just now',
                createdAt: new Date().toISOString(),
                type: 'text',
                isMyMessage: true,
                avatar: fallbackAvatar
            };
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, newMsg];
                updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                return updatedMessages;
            });
            setNewMessage('');
        }
    };

    const handleSend = () => {
        handleSendMessage();
    };

    const handleBack = () => {
        setActiveConversation(null);
    };

    const fetchMoreMessages = () => {
        if (!isMessagesLoading && messagesData?.data?.meta?.totalPage > page) {
            setPage(prevPage => prevPage + 1);
        }
    };

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
                            <div className="h-full w-full flex items-center justify-center">
                                <Skeleton className="h-full w-full" />
                            </div>
                        ) : isMessagesError ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <LoadFailed msg="Failed to load messages." />
                            </div>
                        ) : (
                            <MessagePanel
                                conversation={activeConversation}
                                messages={messages}
                                onBack={handleBack}
                                onOpenMedia={() => setIsMediaSheetOpen(true)}
                                newMessage={newMessage}
                                setNewMessage={setNewMessage}
                                                                onSendMessage={handleSend}
                                fetchMoreMessages={fetchMoreMessages}
                                isMessagesLoading={isMessagesLoading} />
                        )
                    )}
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
                                <div className="h-full w-full flex items-center justify-center">
                                    <Skeleton className="h-full w-full" />
                                </div>
                            ) : isMessagesError ? (
                                <div className="h-full w-full flex items-center justify-center">
                                    <LoadFailed msg="Failed to load messages." />
                                </div>
                            ) : (
                                <MessagePanel
                                    conversation={activeConversation}
                                    messages={messages}
                                    onBack={handleBack}
                                    onOpenMedia={() => setIsMediaSheetOpen(true)}
                                    newMessage={newMessage}
                                    setNewMessage={setNewMessage}
                                    onSendMessage={handleSend}
                                    fetchMoreMessages={fetchMoreMessages}
                                    isMessagesLoading={isMessagesLoading} />
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
