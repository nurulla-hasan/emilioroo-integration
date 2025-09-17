// "use client";

// import React, { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";

// const EditConversationModal = ({ isOpen, onOpenChange, onUpdateConversation, isLoading, topic }) => {
//     const [name, setName] = useState("");
//     const [isPublic, setIsPublic] = useState(false);

//     useEffect(() => {
//         if (topic) {
//             setName(topic.name);
//             setIsPublic(topic.isPublic || false);
//         }
//     }, [topic]);

//     const handleSubmit = () => {
//         onUpdateConversation({ ...topic, name, isPublic });
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                     <DialogTitle>Edit conversation</DialogTitle>
//                     <DialogDescription>
//                         Update the conversation name and visibility.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                     <div className="flex flex-col gap-2">
//                         <Label htmlFor="name">
//                             Name
//                         </Label>
//                         <Input
//                             id="name"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             className="col-span-3"
//                             placeholder="e.g., General Chat"
//                         />
//                     </div>
//                     <div className="flex items-center space-x-2 mt-2">
//                         <Checkbox
//                             id="isPublic"
//                             checked={isPublic}
//                             onCheckedChange={setIsPublic}
//                         />
//                         <Label htmlFor="isPublic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                             Public (anyone can view this conversation)
//                         </Label>
//                     </div>
//                 </div>
//                 <DialogFooter>
//                     <DialogClose asChild>
//                         <Button size={"sm"} variant="outline">Cancel</Button>
//                     </DialogClose>
//                     <Button loading={isLoading} size={"sm"} onClick={handleSubmit} disabled={isLoading}>
//                         Update Conversation
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default EditConversationModal;
