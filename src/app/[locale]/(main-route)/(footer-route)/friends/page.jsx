"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import FriendCard from "@/components/friends/FriendCard";
import FriendRequestCard from "@/components/friends/FriendRequestCard";
import PageLayout from "@/components/layout/PageLayout";
import { useGetFollowersQuery, useGetMyFriendsQuery } from "@/lib/features/api/friendsApi";
import PeopleCardSkeleton from "@/components/skeleton/PeopleCardSkeleton";
import LoadFailed from "@/components/common/LoadFailed";
import CustomPagination from "@/components/common/CustomPagination";


const Friends = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);

    const { data: myFriendData, isLoading: isMyFriendLoading, isError: isMyFriendError } = useGetMyFriendsQuery([
        { name: "page", value: currentPage },
        { name: "limit", value: pageSize },
        { name: "searchTerm", value: searchTerm },
    ]);
    const { data: myFollowerData, isLoading: isMyFollowerLoading, isError: isMyFollowerError } = useGetFollowersQuery([
        { name: "page", value: currentPage },
        { name: "limit", value: pageSize },
        { name: "searchTerm", value: searchTerm },
    ]);
    const myFriends = myFriendData?.data?.data?.result || [];
    const myFollower = myFollowerData?.data?.result || [];

    const friendTotalPages = myFriendData?.data?.meta?.totalPage || 1;
    const followerTotalPages = myFollowerData?.data?.meta?.totalPage || 1;



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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {
                                isMyFriendLoading ? (
                                    <PeopleCardSkeleton count={12} />
                                ) : isMyFriendError ? (
                                    <div className="col-span-full mt-20 mx-auto">
                                        <LoadFailed />
                                    </div>
                                ) : myFriends.length === 0 ? (
                                    <div className="col-span-full mx-auto mt-20 text-muted-foreground">
                                        No friends for now.
                                    </div>
                                ) : (
                                    myFriends?.map((friend) => (
                                        <FriendCard key={friend._id} friend={friend} />
                                    ))
                                )
                            }
                        </div>

                        {myFriends.length > 0 && friendTotalPages > 1 && (
                            <div className="my-4 absolute bottom-0 right-0 left-0">
                                <CustomPagination
                                    currentPage={currentPage}
                                    totalPages={friendTotalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="friend-request">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {
                                isMyFollowerLoading ? (
                                    <PeopleCardSkeleton count={12} />
                                ) : isMyFollowerError ? (
                                    <div className="col-span-full mt-20 mx-auto">
                                        <LoadFailed />
                                    </div>
                                ) : myFollower.length === 0 ? (
                                    <div className="col-span-full mx-auto mt-20 text-muted-foreground">
                                        No followers for now.
                                    </div>
                                ) : (
                                    myFollower?.map((follower) => (
                                        <FriendRequestCard key={follower._id} request={follower} />
                                    ))
                                )
                            }
                        </div>

                        {myFollower.length > 0 && friendTotalPages > 1 && (
                            <div className="my-4 absolute bottom-0 right-0 left-0">
                                <CustomPagination
                                    currentPage={currentPage}
                                    totalPages={followerTotalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </PageLayout>
        </div>
    );
};

export default Friends;