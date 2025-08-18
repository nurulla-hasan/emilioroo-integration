"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react'; 

const PostCard = ({ post }) => {
    const { commentorName, commentorProfileImage, createdAt, text, totalLike, totalReplies } = post;

    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-start space-x-4">
                <Avatar>
                    <AvatarImage src={commentorProfileImage} />
                    <AvatarFallback>{commentorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold">{commentorName}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            <p>{formattedDate}</p>
                        </div>
                    </div>
                    <p className="mt-2">{text}</p>
                    <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>Like ({totalLike})</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>Comment ({totalReplies})</span>
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
