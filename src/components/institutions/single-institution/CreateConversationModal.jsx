"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const CreateConversationModal = ({ isOpen, onOpenChange, onCreateConversation, isLoading }) => {
    const [name, setName] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    const handleSubmit = () => {
        onCreateConversation({ name, isPublic });
        setName("");
        setIsPublic(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a new conversation</DialogTitle>
                    <DialogDescription>
                        Give your conversation a name and set its visibility.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">
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
                    <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                            id="isPublic-create"
                            checked={isPublic}
                            onCheckedChange={setIsPublic}
                        />
                        <Label htmlFor="isPublic-create" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Public (anyone can view this conversation)
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button size={"sm"} variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button loading={isLoading} size={"sm"} onClick={handleSubmit} disabled={isLoading || !name.trim()}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateConversationModal;
