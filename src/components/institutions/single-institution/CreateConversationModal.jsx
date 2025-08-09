"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';

const CreateConversationModal = ({ isOpen, onOpenChange, onCreateConversation, isLoading }) => {
    const [name, setName] = React.useState("");

    const handleSubmit = () => {
        onCreateConversation({ name });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a new conversation</DialogTitle>
                    <DialogDescription>
                        Give your conversation a name. You can change this later.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., General Chat"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button size={"sm"} variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button size={"sm"} onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Creating</>
                        ) : (
                            "Create"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateConversationModal;
