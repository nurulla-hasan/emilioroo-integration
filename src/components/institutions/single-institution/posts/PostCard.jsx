import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Share2, Heart } from 'lucide-react';
import CommentRepliesModal from './CommentRepliesModal';
import { DialogTrigger } from '@/components/ui/dialog';
import { useLikeUnlikeCommentMutation } from '@/lib/features/api/InstitutionApi';
import { toast } from 'sonner';

const PostCard = ({ post }) => {
    const { _id, commentorName, commentorProfileImage, createdAt, text, totalLike, totalReplies, isLikedByMe } = post;
    const [likeUnlikeComment, { isLoading: isLiking }] = useLikeUnlikeCommentMutation();

    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleLikeUnlike = async () => {
        try {
            await likeUnlikeComment(_id).unwrap();
        } catch (error) {
            console.error("Failed to like/unlike comment:", error);
            toast.error(error?.data?.message || "Failed to like/unlike comment.");
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
                            <div className="text-xs text-muted-foreground">
                                <p>{formattedDate}</p>
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
                                    <Heart className="h-4 w-4" fill={isLikedByMe ? "red" : "none"} stroke={isLikedByMe ? "red" : "currentColor"} />
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
                                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                                    <Share2 className="h-4 w-4" />
                                    <span>Share</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostCard;
