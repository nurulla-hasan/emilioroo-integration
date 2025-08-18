import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Image as ImageIcon, SquarePen, Trash2 } from 'lucide-react';
import { useCreateReplyMutation, useGetCommentRepliesQuery } from "@/lib/features/api/InstitutionApi";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

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
                <div className="mt-2 relative h-12 w-12">
                    <Image src={URL.createObjectURL(image)} fill alt="Selected image" className=" object-cover rounded-lg" />
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

const ReplyCard = ({ reply, conversationId, onEditClick, onDeleteClick }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { data: repliesData, isLoading: areRepliesLoading, refetch } = useGetCommentRepliesQuery(reply._id, { skip: !showReplyForm });
    const replies = repliesData?.data?.result;

    const handleDeleteComment = async () => {
        onDeleteClick(reply);
    };

    return (
        <>
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
                        <div className="text-xs text-muted-foreground flex items-center space-x-2">
                            <p>{new Date(reply.createdAt).toLocaleDateString()}</p>
                            {reply.isMyComment && (
                                <>
                                    <SquarePen className="h-4 w-4 cursor-pointer" onClick={() => onEditClick(reply)} />
                                    <Trash2 className="h-4 w-4 cursor-pointer text-red-500" onClick={handleDeleteComment} />
                                </>
                            )}
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
                                        <ReplyList replies={replies} conversationId={conversationId} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
                                    </div>
                                )
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
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

const ReplyList = ({ replies, conversationId, onEditClick, onDeleteClick }) => {
    return (
        <div>
            {replies.map(reply => (
                <ReplyCard key={reply._id} reply={reply} conversationId={conversationId} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
            ))}
        </div>
    );
};

export { ReplyForm, ReplyCard, ReplyCardSkeleton, ReplyList };
