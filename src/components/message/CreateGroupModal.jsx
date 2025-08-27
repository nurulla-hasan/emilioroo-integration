'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MultipleSelector } from "@/components/ui/multiselect";
import { useGetUsersWithoutMe } from '@/hooks/useGetUsersWithoutMe';
import { Label } from '../ui/label';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useCreateGroupMutation } from '@/lib/features/api/chatApi';
import { toast } from 'sonner';
import { ImageUp } from 'lucide-react';

export const CreateGroupModal = ({ isOpen, onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupImageFile, setGroupImageFile] = useState(null);
    const [groupImagePreview, setGroupImagePreview] = useState('');
    const fileInputRef = useRef(null);
    const { users } = useGetUsersWithoutMe();

    const [createGroup, { isLoading }] = useCreateGroupMutation();

    const userOptions = users
        .filter(user => user._id)
        .map(user => ({
            label: user.name,
            value: user._id,
            avatar: user.profile_image
        }));

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedUsers.length === 0) {
            toast.error("Group name and selected members are required.");
            return;
        }

        const formData = new FormData();

        if (groupImageFile) {
            formData.append('group_chat_image', groupImageFile);
        }

        const dataPayload = {
            name: groupName,
            participants: selectedUsers,
        };
        formData.append('data', JSON.stringify(dataPayload));

        try {
            await createGroup(formData).unwrap();
            toast.success('Group created successfully! 🎉');
            onClose();
        } catch (err) {
            console.error('Failed to create group:', err);
            toast.error('Failed to create group. Please try again.');
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setGroupImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setGroupImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setGroupImageFile(null);
            setGroupImagePreview('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Group</DialogTitle>
                    <DialogDescription>
                        Enter group details and select members to create a new chat group.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Group Image selection */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <div
                        className="w-24 h-24 rounded-full bg-muted flex items-center justify-center cursor-pointer mx-auto mb-4"
                        onClick={() => fileInputRef.current.click()}
                    >
                        {groupImagePreview ? (
                            <Avatar className="w-full h-full">
                                <AvatarImage src={groupImagePreview} alt="Group Avatar" className="object-cover" />
                            </Avatar>
                        ) : (
                            <span className="text-muted-foreground text-4xl"><ImageUp /></span>
                        )}
                    </div>
                    {/* Existing Group Name field */}
                    <div>
                        <Label className="mb-2" htmlFor="groupName">Group Name</Label>
                        <Input
                            id="groupName"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter group name"
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Select Members</Label>
                        <MultipleSelector
                            options={userOptions}
                            value={selectedUsers}
                            onChange={setSelectedUsers}
                            placeholder="Select users..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button loading={isLoading} onClick={handleCreateGroup} disabled={isLoading}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
