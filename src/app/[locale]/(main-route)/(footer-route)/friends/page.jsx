"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import FriendCard from "@/components/friends/FriendCard";
import FriendRequestCard from "@/components/friends/FriendRequestCard"; // Import new component
import PageLayout from "@/components/layout/PageLayout";
import { fallbackAvatar } from "@/lib/utils";

const fakeFriends = [
    {
        id: 1,
        name: "MR. Sarwar",
        avatar: fallbackAvatar,
        tags: ["Artist", "Actor", "Teacher"],
    },
    {
        id: 2,
        name: "MR. Fahad",
        avatar: fallbackAvatar,
        tags: ["Artist", "Actor", "Teacher"],
    },
    {
        id: 3,
        name: "Ahmad musa",
        avatar: fallbackAvatar,
        tags: ["Artist", "Actor", "Teacher"],
    },
    {
        id: 4,
        name: "MR. TA Emon",
        avatar: fallbackAvatar,
        tags: ["Artist", "Actor", "Teacher"],
    },
    {
        id: 5,
        name: "MR. Mehedi",
        avatar: fallbackAvatar,
        tags: ["Artist", "Actor", "Teacher"],
    },
    {
        id: 6,
        name: "MR. Dindinia",
        avatar: fallbackAvatar,
        tags: ["Artist", "Actor", "Teacher"],
    },
    {
        id: 7,
        name: "MR. Nahid",
        avatar: fallbackAvatar,
        tags: ["Artist", "Actor", "Teacher"],
    },
    {
        id: 8,
        name: "MR. Fahad",
        avatar: fallbackAvatar,
        tags: ["Artist", "Actor", "Teacher"],
    },
    {
        id: 9,
        name: "MR. Sarwar",
        avatar: fallbackAvatar,
        tags: ["Artist", "Actor", "Teacher"],
    },
];

const fakeFriendRequests = [
    {
        id: 101,
        name: "MR. Request 1",
        avatar: fallbackAvatar,
        tags: ["Musician", "Student"],
    },
    {
        id: 102,
        name: "MR. Request 2",
        avatar: fallbackAvatar,
        tags: ["Developer", "Gamer"],
    },
];

const Friends = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFriends = fakeFriends.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFriendRequests = fakeFriendRequests.filter(request =>
        request.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-minus-header">
            <PageLayout>
                <Tabs defaultValue="my-friends" className="w-full">
                    <div className="flex justify-between items-center mb-6">
                        <TabsList>
                            <TabsTrigger value="my-friends">My Friends</TabsTrigger>
                            <TabsTrigger value="friend-request">Friend Request</TabsTrigger>
                        </TabsList>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search Friend"
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <TabsContent value="my-friends">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredFriends.map((friend) => (
                                <FriendCard key={friend.id} friend={friend} />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="friend-request">
                        {filteredFriendRequests.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {filteredFriendRequests.map((request) => (
                                    <FriendRequestCard key={request.id} request={request} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                No friend requests for now.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </PageLayout>
        </div>
    );
};

export default Friends;