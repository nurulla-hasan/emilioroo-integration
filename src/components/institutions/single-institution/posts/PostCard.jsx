"use client";

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Loader2, MoreHorizontal } from 'lucide-react';
import CommentRepliesModal from './CommentRepliesModal';
import { DialogTrigger } from '@/components/ui/dialog';
import { useLikeUnlikeCommentMutation, useDeleteCommentMutation } from '@/lib/features/api/InstitutionApi';
import { toast } from 'sonner';
import EditCommentModal from './EditCommentModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { timeAgo } from '@/lib/utils';

const PostCard = ({ post }) => {
    const { _id, commentorName, commentorProfileImage, createdAt, text, totalLike, totalReplies, isMyComment, isMyLike } = post;
    const [likeUnlikeComment, { isLoading: isLiking }] = useLikeUnlikeCommentMutation();
    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);



    const handleLikeUnlike = async () => {
        try {
            await likeUnlikeComment(_id).unwrap();
        } catch (error) {
            console.error("Failed to like/unlike comment:", error);
            toast.error(error?.data?.message || "Failed to like/unlike comment.");
        }
    };

    const handleDeleteComment = async () => {
        try {
            await deleteComment(_id).unwrap();
            toast.success("Comment deleted successfully!");
            setIsDeleteConfirmOpen(false);
        } catch (error) {
            console.error("Failed to delete comment:", error);
            toast.error(error?.data?.message || "Failed to delete comment.");
        }
    };

    return (
        <>
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
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <p>{timeAgo(createdAt)}</p>
                                {isMyComment && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-auto p-1">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setIsDeleteConfirmOpen(true)} className="text-red-500">
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                        <p className="mt-2">{text}</p>
                        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center space-x-1"
                                    onClick={handleLikeUnlike}
                                    disabled={isLiking}
                                >
                                    <Heart className="h-4 w-4" fill={isMyLike ? "red" : "none"} stroke={isMyLike ? "red" : "currentColor"} />
                                    <span>Like ({totalLike})</span>
                                </Button>
                                <CommentRepliesModal commentId={_id}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                                            <MessageSquare className="h-4 w-4" />
                                            <span>Comment ({totalReplies})</span>
                                        </Button>
                                    </DialogTrigger>
                                </CommentRepliesModal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditCommentModal
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                comment={post}
            />
            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onOpenChange={setIsDeleteConfirmOpen}
                title="Confirm Deletion"
                description="Are you sure you want to delete this comment? This action cannot be undone."
                onConfirm={handleDeleteComment}
                confirmText={isDeleting ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting</> : "Delete"}
            />
        </>
    );
};

export default PostCard;
