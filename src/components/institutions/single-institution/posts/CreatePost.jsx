"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon } from 'lucide-react';
import { useCreateCommentMutation } from '@/lib/features/api/InstitutionApi';
import { toast } from 'sonner';
import Image from 'next/image';

const CreatePost = ({ selectedTopic }) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [createComment, { isLoading }] = useCreateCommentMutation();
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (image) {
            formData.append("comment_image", image);
        }
        formData.append("data", JSON.stringify({ text, institutionConversation: selectedTopic._id }));

        try {
            await createComment(formData).unwrap();
            toast.success("Post created successfully!");
            setText("");
            setImage(null);
        } catch (error) {
            console.error("Failed to create post:", error);
            toast.error(error?.data?.message || "Failed to create post.");
        }
    };

    return (
        <div className="bg-card p-4 rounded-lg border">
            <form onSubmit={handleSubmit}>
                <div className="flex items-start space-x-4">
                    <div className="w-full">
                        <Textarea
                            placeholder="Write something on this topic..."
                            className="w-full bg-transparent border-0 focus:ring-0 resize-none"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        {image && (
                            <div className="mt-2 relative h-12 w-12">
                                <Image src={URL.createObjectURL(image)} alt="Selected image" fill className="object-cover rounded-lg" />
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <ImageIcon className="h-5 w-5 cursor-pointer" onClick={() => fileInputRef.current.click()} />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <Button loading={isLoading} type="submit" disabled={isLoading || !text.trim()}>
                                Post
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
