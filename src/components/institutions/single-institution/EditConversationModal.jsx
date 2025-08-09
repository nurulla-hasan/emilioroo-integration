"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';

const EditConversationModal = ({ isOpen, onOpenChange, onUpdateConversation, isLoading, topic }) => {
    const [name, setName] = useState("");

    useEffect(() => {
        if (topic) {
            setName(topic.name);
        }
    }, [topic]);

    const handleSubmit = () => {
        onUpdateConversation({ ...topic, name });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit conversation name</DialogTitle>
                    <DialogDescription>
                        Give your conversation a new name. You can change this later.
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
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating</>
                        ) : (
                            "Update Conversation"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditConversationModal;
