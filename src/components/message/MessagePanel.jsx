'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { Message } from './Message';
import { ArrowLeft, Info, PlusCircle, Send, X } from "lucide-react";

export const MessagePanel = ({
    conversation,
    messages,
    onOpenMedia,
    newMessage,
    setNewMessage,
    onSendMessage,
    fetchMoreMessages,
    isMessagesLoading,
    onBack
}) => {
    const messagesEndRef = useRef(null);
    const scrollViewportRef = useRef(null);
    const prevScrollHeightRef = useRef(null);
    const fileInputRef = useRef(null);
    const [stagedFiles, setStagedFiles] = useState([]);

    const lastMessage = messages[messages.length - 1];
    useEffect(() => {
        if (prevScrollHeightRef.current === null) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [lastMessage]);

    useEffect(() => {
        if (prevScrollHeightRef.current !== null && scrollViewportRef.current) {
            const scrollViewport = scrollViewportRef.current;
            const newScrollHeight = scrollViewport.scrollHeight;
            scrollViewport.scrollTop = newScrollHeight - prevScrollHeightRef.current;
            prevScrollHeightRef.current = null;
        }
    }, [messages]);

    const handleScroll = (e) => {
        const scrollViewport = e.currentTarget;
        scrollViewportRef.current = scrollViewport;

        if (scrollViewport.scrollTop === 0 && !isMessagesLoading) {
            prevScrollHeightRef.current = scrollViewport.scrollHeight;
            fetchMoreMessages();
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setStagedFiles([file]); // For now, only one file
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeStagedFile = (fileToRemove) => {
        setStagedFiles(stagedFiles.filter(file => file !== fileToRemove));
    };

    const handleSendClick = () => {
        if (newMessage.trim() === '' && stagedFiles.length === 0) {
            return; // Nothing to send
        }
        onSendMessage(newMessage, stagedFiles);
        setNewMessage('');
        setStagedFiles([]);
    };

    return (
        <div className="w-full bg-card flex flex-col h-full">
            <div className="p-3 border-b flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={onBack}>
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
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="xl:hidden" onClick={onOpenMedia}>
                        <Info />
                    </Button>
                </div>
            </div>
            <ScrollArea className="flex-1 p-4 h-96 bg-background/50" onScroll={handleScroll}>
                {messages.map(msg => <Message key={msg._id} msg={msg} />)}
                <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-4 border-t bg-card">
                {stagedFiles.length > 0 && (
                    <div className="p-2">
                        {stagedFiles.map((file, index) => (
                            <div key={index} className="relative w-16 h-16 inline-block">
                                <Image src={URL.createObjectURL(file)} layout="fill" className="object-cover rounded-lg" alt={`Staged file ${index + 1}`} />
                                <button onClick={() => removeStagedFile(file)} className="absolute top-1 right-1 bg-gray-800/70 text-white rounded-full p-1 cursor-pointer">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="relative flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,video/*"
                    />
                    <Button variant="ghost" size="icon" onClick={handleUploadClick}>
                        <PlusCircle />
                    </Button>
                    <div className="flex-1 relative">
                        <Input
                            placeholder="Aa" value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendClick()}
                            className="rounded-full bg-muted"
                        />
                    </div>
                    <Button
                        onClick={handleSendClick}
                        size="icon" variant="ghost">
                        <Send />
                    </Button>
                </div>
            </div>
        </div>
    );
};