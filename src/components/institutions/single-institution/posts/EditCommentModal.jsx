import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useUpdateCommentMutation } from "@/lib/features/api/InstitutionApi";
import { toast } from "sonner";

const EditCommentModal = ({ isOpen, onOpenChange, comment }) => {
    const [text, setText] = useState(comment?.text || "");
    const [updateComment, { isLoading }] = useUpdateCommentMutation();

    useEffect(() => {
        setText(comment?.text || "");
    }, [comment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateComment({ id: comment._id, data: { text } }).unwrap();
            toast.success("Comment updated successfully!");
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update comment:", error);
            toast.error(error?.data?.message || "Failed to update comment.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Comment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Edit your comment..."
                        className="max-h-48"
                    />
                    <DialogFooter className="mt-4">
                        <Button loading={isLoading} type="submit" disabled={isLoading || !text.trim()}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditCommentModal;
