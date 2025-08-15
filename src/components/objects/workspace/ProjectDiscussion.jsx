"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Upload } from 'lucide-react';

const ProjectDiscussion = ({ messages }) => {
    return (
        <div className="border rounded-lg p-4 mt-8">
            <h2 className="text-lg font-semibold mb-4">Project Discussion</h2>
            <div className="bg-muted/50 rounded-lg p-4 h-96 overflow-y-auto flex flex-col gap-4">
                <div className="text-center text-xs text-muted-foreground">Today</div>
                {messages.map(message => (
                    <div key={message.id} className={`flex items-start gap-3 ${message.isYou ? 'flex-row-reverse' : ''}`}>
                        <Avatar>
                            <AvatarImage src={message.author.avatar} />
                            <AvatarFallback>{message.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={`p-3 rounded-lg max-w-md ${message.isYou ? 'bg-primary text-primary-foreground dark:text-white' : 'bg-background'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-sm">{message.author.name}</p>
                                <p className="text-xs text-muted-foreground">{message.author.role}</p>
                            </div>
                            <p className='dark:text-white'>{message.text}</p>
                            <p className={`text-xs mt-1 ${message.isYou ? 'text-primary-foreground/80 dark:text-white' : 'text-muted-foreground'}`}>{message.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex items-center gap-4">
                <div className="relative flex-grow">
                    <Input placeholder="Send Message" className="pr-12" />
                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
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
