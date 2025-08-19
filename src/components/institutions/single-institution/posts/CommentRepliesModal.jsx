import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useGetCommentRepliesQuery, useDeleteCommentMutation } from "@/lib/features/api/InstitutionApi";
import { useState } from "react";
import { toast } from "sonner";
import EditCommentModal from './EditCommentModal';
import ConfirmationModal from '@/components/common/ConfirmationModal'; 
import { Skeleton } from "@/components/ui/skeleton";
import ReplyList from "./ReplyList";
import ReplyForm from "./ReplyForm";

const CommentRepliesModal = ({ commentId, children }) => {
    const { data: repliesData, isLoading, isError, refetch } = useGetCommentRepliesQuery(commentId, { skip: !commentId });
    const replies = repliesData?.data?.result;
    const conversationId = repliesData?.data?.result?.[0]?.conversation;

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedCommentForEdit, setSelectedCommentForEdit] = useState(null);
    const [selectedCommentForDelete, setSelectedCommentForDelete] = useState(null);

    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

    const handleReplyCreated = () => {
        refetch();
    };

    const handleEditClick = (comment) => {
        setSelectedCommentForEdit(comment);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (comment) => {
        setSelectedCommentForDelete(comment);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedCommentForDelete) {
            try {
                await deleteComment(selectedCommentForDelete._id).unwrap();
                toast.success("Comment deleted successfully!");
                setIsDeleteConfirmOpen(false);
                refetch(); // Refetch parent comments to update UI
            } catch (error) {
                console.error("Failed to delete comment:", error);
                toast.error(error?.data?.message || "Failed to delete comment.");
            }
        }
    };

    return (
        <Dialog>
            {children}
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Replies</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
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
                            <ReplyList replies={replies} conversationId={conversationId} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
                        ) : (
                            <p>No replies yet.</p>
                        )
                    )}
                </div>
                <DialogFooter>
                    <ReplyForm parentId={commentId} conversationId={conversationId} onReplyCreated={handleReplyCreated} />
                </DialogFooter>
            </DialogContent>
            <EditCommentModal
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                comment={selectedCommentForEdit}
            />
            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onOpenChange={setIsDeleteConfirmOpen}
                title="Confirm Deletion"
                description="Are you sure you want to delete this reply? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                confirmText="Delete"
                loading={isDeleting}
            />
        </Dialog>
    );
};

export default CommentRepliesModal;