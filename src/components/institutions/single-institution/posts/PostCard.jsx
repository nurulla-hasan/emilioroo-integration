"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';

const PostCard = ({ post }) => {
    return (
        <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-start space-x-4">
                <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold">{post.author.name}</p>
                            <p className="text-sm text-muted-foreground">{post.author.title}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            <p>{post.date}</p>
                            <p>{post.time}</p>
                        </div>
                    </div>
                    <p className="mt-2">{post.content}</p>
                    <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>Like ({post.likes})</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>Comment ({post.comments})</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
