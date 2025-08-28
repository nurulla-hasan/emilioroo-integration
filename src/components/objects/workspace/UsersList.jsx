"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CardSkeleton from '@/components/skeleton/CardSkeleton';
import { fallbackAvatar } from '@/lib/utils';

const UsersList = ({ users, isLoading, isError }) => {
    if (isLoading) {
        return <CardSkeleton count={5} />;
    }

    if (isError) {
        return <p className="text-red-500">Error loading users.</p>;
    }

    return (
        <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Users</h2>
            <div className="space-y-3 max-h-[884px] overflow-y-auto">
                {!isLoading && !isError && users && users.length === 0 && (
                    <p className="text-muted-foreground">No users found.</p>
                )}
                {users && users.map(user => (
                    <div key={user._id} className="flex items-center gap-3 border p-2 rounded-md">
                        <Avatar>
                            <AvatarImage src={user.user?.profile_image || fallbackAvatar("MALE")} />
                            <AvatarFallback>{user.user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">{user.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersList;
