
'use client';

import { useState } from 'react';
import { ConversationList } from "@/components/message/ConversationList";
import { MessagePanel } from "@/components/message/MessagePanel";
import { MediaPanel } from "@/components/message/MediaPanel";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { fakeConversations, fakeMessages } from "@/components/message/data";

const MessagePage = () => {
    const [activeConversation, setActiveConversation] = useState(fakeConversations[0]);
    const [messages, setMessages] = useState(fakeMessages[fakeConversations[0].id]);
    const [newMessage, setNewMessage] = useState('');
    const [isMediaSheetOpen, setIsMediaSheetOpen] = useState(false);

    const handleConversationClick = (conv) => {
        setActiveConversation(conv);
        setMessages(fakeMessages[conv.id] || []);
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && activeConversation) {
            const newMsg = { id: messages.length + 1, text: newMessage, sender: 'me', time: 'Now', type: 'text' };
            const updatedMessages = [...messages, newMsg];
            setMessages(updatedMessages);
            fakeMessages[activeConversation.id] = updatedMessages;
            setNewMessage('');
        }
    };

    const handleBack = () => {
        setActiveConversation(null);
    };

    return (
        <div className="h-[calc(100vh-80px)] w-full">
            <div className="flex h-full bg-card border rounded-lg">
                {/* Mobile View */}
                <div className="w-full lg:hidden">
                    {!activeConversation ? (
                        <ConversationList
                            conversations={fakeConversations}
                            activeConversation={activeConversation}
                            onConversationClick={handleConversationClick} />
                    ) : (
                        <MessagePanel
                            conversation={activeConversation}
                            messages={messages}
                            onBack={handleBack}
                            onOpenMedia={() => setIsMediaSheetOpen(true)}
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            onSendMessage={handleSendMessage} />
                    )}
                </div>

                {/* Desktop View */}
                <div className="hidden lg:flex w-full">
                    <div className="w-1/3 xl:w-1/4 border-r">
                        <ConversationList
                            conversations={fakeConversations}
                            activeConversation={activeConversation}
                            onConversationClick={handleConversationClick} />
                    </div>
                    <div className="w-2/3 xl:w-1/2">
                        {activeConversation ? (
                            <MessagePanel
                                conversation={activeConversation}
                                messages={messages}
                                onBack={handleBack}
                                onOpenMedia={() => setIsMediaSheetOpen(true)}
                                newMessage={newMessage}
                                setNewMessage={setNewMessage}
                                onSendMessage={handleSendMessage} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground"><p>Select a conversation to start chatting.</p></div>
                        )}
                    </div>
                    <div className="hidden xl:flex w-1/4 border-l">
                        <MediaPanel />
                    </div>
                </div>

                <Sheet open={isMediaSheetOpen} onOpenChange={setIsMediaSheetOpen}>
                    <SheetContent side="right" className="p-0 w-full sm:w-96">
                        <SheetHeader className="p-4 border-b">
                            <SheetTitle>Media and files</SheetTitle>
                            <SheetDescription>Media and files shared in this conversation.</SheetDescription>
                        </SheetHeader>
                        <MediaPanel />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default MessagePage;
