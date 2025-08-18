"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon } from 'lucide-react';

const CreatePost = () => {
    return (
        <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-start space-x-4">
                <div className="w-full">
                    <Textarea
                        placeholder="Write something on this topic..."
                        className="w-full bg-transparent border-0 focus:ring-0 resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                            {/* <Paperclip className="h-5 w-5 cursor-pointer" /> */}
                            <ImageIcon className="h-5 w-5 cursor-pointer" />
                        </div>
                        <Button>Post</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
