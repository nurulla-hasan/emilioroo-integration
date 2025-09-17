// "use client";

// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { MultipleSelector } from '../../ui/multiselect';
// import { useGetAllUsersQuery } from '@/lib/features/api/projectApi';

// const CreateConversationModal = ({ isOpen, onOpenChange, onCreateConversation, isLoading }) => {
//     const [name, setName] = useState("");
//     const [isPrivate, setIsPrivate] = useState(false);
//     const [selectedUsers, setSelectedUsers] = useState([]);

//     const { data: usersData } = useGetAllUsersQuery();

//     const userOptions = usersData?.data?.result?.map(user => ({
//         value: user._id,
//         label: user.name,
//         user: user.user,
//         avatar: user.profile_image,
//         gender: user.gender
//     })) || [];

//     const handleSubmit = () => {
//         const conversationData = {
//             name,
//             isPublic: !isPrivate,
//         };

//         if (isPrivate) {
//             conversationData.ussers = selectedUsers.map(u => u);
//         }
//         onCreateConversation(conversationData);
//         setName("");
//         setIsPrivate(false);
//         setSelectedUsers([]);
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                     <DialogTitle>Create a new conversation</DialogTitle>
//                     <DialogDescription>
//                         Give your conversation a name and set its visibility.
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
//                     {isPrivate && (
//                         <div className="flex flex-col gap-2">
//                             <Label htmlFor="users">
//                                 Select Users
//                             </Label>
//                             <MultipleSelector
//                                 value={selectedUsers}
//                                 onChange={setSelectedUsers}
//                                 options={userOptions}
//                                 placeholder="Select users..."
//                             />
//                         </div>
//                     )}
//                     <div className="flex items-center space-x-2 mt-2">
//                         <Checkbox
//                             id="isPrivate-create"
//                             checked={isPrivate}
//                             onCheckedChange={setIsPrivate}
//                         />
//                         <Label htmlFor="isPrivate-create" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                             Private <span className='text-muted-foreground text-xs'>(only selected users can view this conversation)</span>
//                         </Label>
//                     </div>

//                 </div>
//                 <DialogFooter>
//                     <DialogClose asChild>
//                         <Button size={"sm"} variant="outline">Cancel</Button>
//                     </DialogClose>
//                     <Button loading={isLoading} size={"sm"} onClick={handleSubmit} disabled={isLoading || !name.trim()}>
//                         Create
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default CreateConversationModal;
