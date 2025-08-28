import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const SendMessageModal = ({ isOpen, onOpenChange, receiverName, onSend }) => {
    const [message, setMessage] = useState('');

    const handleSendClick = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send a message to {receiverName}</DialogTitle>
                    <DialogDescription>
                        This will start a new conversation if one does not already exist.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Label htmlFor="message">Your message</Label>
                    <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleSendClick}>Send Message</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};