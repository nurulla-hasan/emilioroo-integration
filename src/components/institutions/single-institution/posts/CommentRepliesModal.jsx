import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useGetCommentRepliesQuery, useCreateReplyMutation } from "@/lib/features/api/InstitutionApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Image as ImageIcon } from 'lucide-react';

const ReplyForm = ({ parentId, conversationId, onReplyCreated }) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [createReply, { isLoading }] = useCreateReplyMutation();
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
        formData.append("data", JSON.stringify({ text, parent: parentId, conversation: conversationId }));

        try {
            await createReply(formData).unwrap();
            toast.success("Reply created successfully!");
            setText("");
            setImage(null);
            if (onReplyCreated) {
                onReplyCreated();
            }
        } catch (error) {
            console.error("Failed to create reply:", error);
            toast.error(error?.data?.message || "Failed to create reply.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 w-full">
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a reply..."
                className="max-h-28"
            />
            {image && (
                <div className="mt-2">
                    <img src={URL.createObjectURL(image)} alt="Selected image" className="h-20 w-20 object-cover rounded-lg" />
                </div>
            )}
            <div className="flex justify-between items-center mt-2">
                <ImageIcon className="h-5 w-5 cursor-pointer" onClick={() => fileInputRef.current.click()} />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                />
                <Button type="submit" disabled={isLoading || !text.trim()} className="mt-2">
                    {isLoading ? "Replying..." : "Reply"}
                </Button>
            </div>
        </form>
    );
};

const ReplyCard = ({ reply, conversationId }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { data: repliesData, isLoading: areRepliesLoading, refetch } = useGetCommentRepliesQuery(reply._id, { skip: !showReplyForm });
    const replies = repliesData?.data?.result;

    return (
        <div className="flex items-start space-x-4 mt-4 border rounded-lg p-3">
            <Avatar>
                <AvatarImage src={reply.commentorProfileImage} />
                <AvatarFallback>{reply.commentorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="w-full min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-sm">{reply.commentorName}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <p>{new Date(reply.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <p className="mt-2 break-words text-xs">{reply.text}</p>
                <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(!showReplyForm)}>
                    Reply {reply.totalReplies > 0 && `(${reply.totalReplies})`}
                </Button>
                {showReplyForm && (
                    <>
                        <ReplyForm parentId={reply._id} conversationId={conversationId} onReplyCreated={refetch} />
                        {areRepliesLoading ? (
                            <div className="pl-4 border-l-2 border-gray-200 ml-4">
                                <ReplyCardSkeleton />
                            </div>
                        ) : (
                            replies && replies.length > 0 && (
                                <div className="pl-4 border-l-2 border-gray-200 ml-4">
                                    <ReplyList replies={replies} conversationId={conversationId} />
                                </div>
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const ReplyCardSkeleton = () => {
    return (
        <div className="flex items-start space-x-4 mt-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="w-full">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full mt-2" />
            </div>
        </div>
    );
};

const ReplyList = ({ replies, conversationId }) => {
    return (
        <div>
            {replies.map(reply => (
                <ReplyCard key={reply._id} reply={reply} conversationId={conversationId} />
            ))}
        </div>
    );
};

const CommentRepliesModal = ({ commentId, children }) => {
    const { data: repliesData, isLoading, isError, refetch } = useGetCommentRepliesQuery(commentId, { skip: !commentId });
    const replies = repliesData?.data?.result;
    const conversationId = repliesData?.data?.result?.[0]?.conversation;

    const handleReplyCreated = () => {
        refetch();
    };

    return (
        <Dialog>
            {children}
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Replies</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4 mt-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="w-full">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-full mt-2" />
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 mt-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="w-full">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-full mt-2" />
                                </div>
                            </div>
                        </div>
                    ) : isError ? (
                        <p className="text-red-500">Error loading replies.</p>
                    ) : (
                        replies && replies.length > 0 ? (
                            <ReplyList replies={replies} conversationId={conversationId} />
                        ) : (
                            <p>No replies yet.</p>
                        )
                    )}
                </div>
                <DialogFooter>
                    <ReplyForm parentId={commentId} conversationId={conversationId} onReplyCreated={handleReplyCreated} />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CommentRepliesModal;
