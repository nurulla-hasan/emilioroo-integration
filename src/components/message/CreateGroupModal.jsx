'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MultipleSelector } from "@/components/ui/multiselect";
import { useGetUsersWithoutMe } from '@/hooks/useGetUsersWithoutMe';
import { Label } from '../ui/label';

export const CreateGroupModal = ({ isOpen, onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { users } = useGetUsersWithoutMe();

    const userOptions = users.map(user => ({
        label: user.name,
        value: user._id,
        avatar: user.profile_image
    }));

    const handleCreateGroup = () => {
        // Handle group creation logic here
        console.log('Group Name:', groupName);
        console.log('Selected Users:', selectedUsers);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
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
                    <Button onClick={handleCreateGroup}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
