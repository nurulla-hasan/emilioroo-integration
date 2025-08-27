"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ConversationList } from "@/components/message/ConversationList";
import { MessagePanel } from "@/components/message/MessagePanel";
import { MediaPanel } from "@/components/message/MediaPanel";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { fakeMediaByConversation } from "@/components/message/data";
import { Skeleton } from "@/components/ui/skeleton";
import LoadFailed from "@/components/common/LoadFailed";
import { fallbackAvatar, timeAgo } from "@/lib/utils";
import { useSocket } from '@/context/soket-context/SocketContext';
import { useGetChatListQuery, useGetSingleConversationQuery } from "@/lib/features/api/chatApi";
import { baseApi } from "@/lib/features/api/baseApi";
import MessagePanelSkeleton from "@/components/skeleton/MessagePanelSkeleton";

const MessagePage = () => {
    const { socket, sendMessage, sendSeen } = useSocket();
    const dispatch = useDispatch();
    const markAsSeen = useCallback((messageId) => {
        sendSeen({ messageId });
    }, [sendSeen]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const { data: chatListData, isLoading: isChatListLoading, isError: isChatListError } = useGetChatListQuery(
        {
            searchTerm
        }
    );
    const conversations = useMemo(() => {
        const conversationData = chatListData?.data?.data || [];

        const uniqueConversationMap = new Map();

        for (const conv of conversationData) {
            let uniqueKey;
            if (conv.type === 'one-two-one') {
                uniqueKey = conv.userData?._id;
            } else if (conv.type === 'group') {
                uniqueKey = conv.chatGroup?._id || conv.bondLink?._id || conv.project?._id;
            }
            
            if (uniqueKey && !uniqueConversationMap.has(uniqueKey)) {
                uniqueConversationMap.set(uniqueKey, conv);
            }
        }

        const uniqueConversations = Array.from(uniqueConversationMap.values());

        return uniqueConversations.map(conv => {
            const isGroup = conv.type === 'group';
            let subtype = 'oneToOne';
            let name = conv.userData?.name;
            let avatar = conv.userData?.profile_image || fallbackAvatar;

            if (isGroup) {
                if (conv.chatGroup) {
                    subtype = 'chatGroup';
                    name = conv.chatGroup.name;
                    avatar = conv.chatGroup.image || fallbackAvatar;
                } else if (conv.bondLink) {
                    subtype = 'bondLink';
                    name = conv.bondLink.name;
                    avatar = conv.bondLink.cover_image || "/images/groupFallback.jpg";
                } else if (conv.project) {
                    subtype = 'project';
                    name = conv.project.name;
                    avatar = conv.project.cover_image || fallbackAvatar;
                }
            }

            return {
                id: conv._id,
                conversationId: conv._id,
                userId: conv.userData?._id,
                type: conv.type,
                subtype,
                bondLinkId: conv.bondLink?._id,
                projectId: conv.project?._id,
                chatGroupId: conv.chatGroup?._id,
                name: name || (isGroup ? 'Group' : 'Unknown User'),
                avatar,
                lastMessage: conv.lastMessage?.text || 'No messages yet',
                time: timeAgo(conv.lastMessage?.createdAt || conv.updated_at),
                online: false,
            };
        });
    }, [chatListData]);

    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isMediaSheetOpen, setIsMediaSheetOpen] = useState(false);
    const [mediaUrls, setMediaUrls] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

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

        const handleGenericMessage = (msg) => {
            if (activeConversation && msg.conversationId === activeConversation.conversationId) {
                return;
            }
            const targetConversation = conversations.find(conv => conv.conversationId === msg.conversationId);
            if (targetConversation) {
                dispatch(baseApi.util.invalidateQueries('getSingleConversation', { userId: targetConversation.userId }));
            }
        };
        socket.on("message", handleGenericMessage);
        return () => {
            socket.off("message", handleGenericMessage);
        };
    }, [socket, activeConversation, conversations, dispatch]);

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
        setPage(1);
    }, [activeConversation]);

    const handleConversationClick = (conv) => {
        setActiveConversation(conv);
    };

    const handleFileSelect = async (file) => {
        if (!file) return;

        setIsUploading(true);

        // --- Placeholder for file upload logic ---
        // TODO: Replace this with the actual file upload API call tomorrow.
        const uploadFile = async (fileToUpload) => {
            console.log("Uploading file:", fileToUpload.name);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Return a dummy URL. The real function will return the URL from the backend.
            const dummyUrl = `https://dummy-url.com/uploads/${fileToUpload.name}`;
            console.log("File uploaded, got URL:", dummyUrl);
            return dummyUrl;
        };
        // --- End of placeholder ---

        try {
            const url = await uploadFile(file);
            // Assuming for now that we only handle one file at a time,
            // and it's an image. This can be expanded.
            setMediaUrls(prev => [...prev, { type: 'image', url }]);
        } catch (error) {
            console.error("File upload failed:", error);
            // Optionally, show an error to the user
        } finally {
            setIsUploading(false);
        }
    };

    const handleSendMessage = () => {
        if ((newMessage.trim() || mediaUrls.length > 0) && activeConversation) {
            const payload = {
                text: newMessage,
                imageUrl: mediaUrls.filter(m => m.type === 'image').map(m => m.url),
                videoUrl: mediaUrls.filter(m => m.type === 'video').map(m => m.url),
            };

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

            const tempId = `optimistic-${Date.now()}`;
            const newMsg = {
                _id: tempId,
                id: tempId,
                text: newMessage,
                imageUrl: payload.imageUrl,
                videoUrl: payload.videoUrl,
                sender: 'me',
                time: 'Just now',
                createdAt: new Date().toISOString(),
                isMyMessage: true,
                avatar: fallbackAvatar
            };
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, newMsg];
                updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                return updatedMessages;
            });
            setNewMessage('');
            setMediaUrls([]);
        }
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
                                onOpenMedia={() => setIsMediaSheetOpen(true)}
                                newMessage={newMessage}
                                setNewMessage={setNewMessage}
                                onSendMessage={handleSendMessage}
                                fetchMoreMessages={fetchMoreMessages}
                                isMessagesLoading={isMessagesLoading}
                                onFileSelect={handleFileSelect}
                                isUploadingMedia={isUploading} />
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
                                    onOpenMedia={() => setIsMediaSheetOpen(true)}
                                    newMessage={newMessage}
                                    setNewMessage={setNewMessage}
                                    onSendMessage={handleSendMessage}
                                    fetchMoreMessages={fetchMoreMessages}
                                    isMessagesLoading={isMessagesLoading}
                                    onFileSelect={handleFileSelect}
                                    isUploadingMedia={isUploading} />
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