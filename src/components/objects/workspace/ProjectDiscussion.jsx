"use client";

import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Upload } from 'lucide-react';
import MessagePanelSkeleton from '@/components/skeleton/MessagePanelSkeleton';
import LoadFailed from '@/components/common/LoadFailed';
import NoData from '@/components/common/NoData';
import { getInitials, timeAgo } from '@/lib/utils';

const ProjectDiscussion = ({ messages, isLoading, isError, newMessage, setNewMessage, onSendMessage }) => {
    const messagesContainerRef = useRef(null);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSendMessage();
        }
    };

    return (
        <div className="border rounded-lg p-4 mt-8">
            <h2 className="text-lg font-semibold mb-4">Project Discussion</h2>
            <div ref={messagesContainerRef} className="bg-muted/50 rounded-lg p-4 h-96 overflow-y-auto flex flex-col-reverse gap-4">
                {isLoading ? (
                    <MessagePanelSkeleton />
                ) : isError ? (
                    <div className="h-full flex items-center justify-center">
                        <LoadFailed msg="Failed to load messages" />
                    </div>
                ) : messages && messages.length > 0 ? (
                    <>
                        {/* <div className="text-center text-xs text-muted-foreground">Today</div> */}
                        {messages.map(message => (
                            <div key={message._id} className={`flex items-start gap-3 ${message.isMyMessage ? 'flex-row-reverse' : ''}`}>
                                {!message.isMyMessage && (
                                    <Avatar>
                                        <AvatarImage src={message.userDetails?.profile_image} />
                                        <AvatarFallback>{getInitials(message.userDetails?.name)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className="flex flex-col gap-1">
                                    {!message.isMyMessage && <p className="text-[10px]">{message.userDetails?.name}</p>}
                                    <div className={`px-2 pb-1 rounded-lg max-w-md ${message.isMyMessage ? 'bg-primary text-primary-foreground dark:text-white' : 'bg-background'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                        </div>
                                        <p className='dark:text-white text-sm'>{message.text}</p>
                                        <p className={`text-xs mt-1 ${message.isMyMessage ? 'text-primary-foreground/80 dark:text-muted-foreground text-end' : 'text-muted-foreground'}`}>{timeAgo(message.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <NoData msg="No messages yet" />
                    </div>
                )}
            </div>
            <div className="mt-4 flex items-center gap-4">
                <div className="relative flex-grow">
                    <Input
                        placeholder="Send Message"
                        className="pr-12"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={onSendMessage}>
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
                <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload file
                </Button>
            </div>
        </div>
    );
};

export default ProjectDiscussion;
