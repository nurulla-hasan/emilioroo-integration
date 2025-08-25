
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProposeLinkModal({ isOpen, onOpenChange, onPropose, isLoading }) {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name) {
            onPropose(name);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Propose a Bond Link</DialogTitle>
                    <DialogDescription>
                        Enter a name for your new bond link group. This will be visible to all participants.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 items-center gap-2">
                        <Label htmlFor="name">
                            Group Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="eg. My Bond Links"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} variant="outline">Cancel</Button>
                    <Button loading={isLoading} onClick={handleSubmit} disabled={isLoading || !name}>
                        Propose
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
