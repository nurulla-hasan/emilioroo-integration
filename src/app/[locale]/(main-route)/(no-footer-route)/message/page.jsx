"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { ConversationList } from "@/components/message/ConversationList";
import { MessagePanel } from "@/components/message/MessagePanel";
import { MediaPanel } from "@/components/message/MediaPanel";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { fakeMediaByConversation } from "@/components/message/data";
import { useGetChatListQuery, useGetSingleConversationQuery } from "@/lib/features/api/chatApi";
import { Skeleton } from "@/components/ui/skeleton";
import LoadFailed from "@/components/common/LoadFailed";
import { fallbackAvatar, timeAgo } from "@/lib/utils";

const MessagePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    console.log(searchTerm);
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
        activeConversation?.userId,
        {
            skip: !activeConversation?.userId,
        }
    );

    useEffect(() => {
        if (messagesData) {
            const transformedMessages = messagesData?.data?.result?.map(msg => ({
                ...msg,
                id: msg._id, 
                sender: msg.isMyMessage ? 'me' : msg.userDetails.name,
                avatar: msg.userDetails.profile_image || fallbackAvatar, 
                time: timeAgo(msg.createdAt),
                type: 'text'
            })) || [];
            setMessages(transformedMessages);
        }
    }, [messagesData]);

    useEffect(() => {
        if (conversations.length > 0 && !initialConversationSet.current) {
            setActiveConversation(conversations[0]);
            initialConversationSet.current = true;
        }
    }, [conversations]);

    const handleConversationClick = (conv) => {
        setActiveConversation(conv);
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && activeConversation) {
            const newMsg = { id: messages.length + 1, text: newMessage, sender: 'me', time: 'Now', type: 'text' };
            const updatedMessages = [...messages, newMsg];
            setMessages(updatedMessages);
            setNewMessage('');
        }
    };

    const handleBack = () => {
        setActiveConversation(null);
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
                                onSendMessage={handleSendMessage} />
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
                                    onSendMessage={handleSendMessage} />
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
