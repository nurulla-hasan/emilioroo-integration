'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from 'react';

import { Message } from './Message';
import { ArrowLeft, ImageUpIcon, Info, PlusCircle, Send, Smile } from "lucide-react";

export const MessagePanel = ({
    conversation,
    messages,
    onBack,
    onOpenMedia,
    newMessage,
    setNewMessage,
    onSendMessage
}) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    return (
        <div className="w-full bg-card flex flex-col h-full">
            <div className="p-3 border-b flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={onBack}>
                        <ArrowLeft />
                    </Button>
                    <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>
                            {conversation.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-lg font-semibold">{conversation.name}</h2>
                        <p className="text-sm text-green-500">Active now</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="xl:hidden" onClick={onOpenMedia}>
                        <Info />
                    </Button>
                </div>
            </div>
            <ScrollArea className="flex-1 p-4 h-96 bg-background/50">
                {messages.map(msg => <Message key={msg.id} msg={msg} />)}
                <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-4 border-t bg-card"><div className="relative flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <PlusCircle />
                </Button>
                <Button variant="ghost" size="icon">
                    <ImageUpIcon />
                </Button><div className="flex-1 relative">
                    <Input
                        placeholder="Aa" value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                        className="rounded-full bg-muted pr-12" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Smile />
                    </Button>
                </div>
                <Button
                    onClick={onSendMessage}
                    size="icon" variant="ghost">
                    <Send />
                </Button>
            </div></div>
        </div>
    );
};