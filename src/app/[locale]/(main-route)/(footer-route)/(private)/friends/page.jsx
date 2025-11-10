"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import FriendCard from "@/components/friends/FriendCard";
import FriendRequestCard from "@/components/friends/FriendRequestCard";
import SentRequestCard from "@/components/friends/SentRequestCard";
import PageLayout from "@/components/layout/PageLayout";
import { useGetFollowersQuery, useGetMyFriendsQuery, useGetFollowingQuery } from "@/lib/features/api/friendsApi";
import PeopleCardSkeleton from "@/components/skeleton/PeopleCardSkeleton";
import LoadFailed from "@/components/common/LoadFailed";
import CustomPagination from "@/components/common/CustomPagination";
import NoData from "@/components/common/NoData";
import { useTranslations } from "next-intl";


const Friends = () => {
    const t = useTranslations('FriendsPage');
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
    const { data: sentRequestData, isLoading: isSentRequestLoading, isError: isSentRequestError } = useGetFollowingQuery([
        { name: "page", value: currentPage },
        { name: "limit", value: pageSize },
        { name: "searchTerm", value: searchTerm },
    ]);

    const myFriends = myFriendData?.data?.result || [];
    const myFollower = myFollowerData?.data?.result || [];
    const sentRequests = sentRequestData?.data?.result || [];

    const friendTotalPages = myFriendData?.data?.meta?.totalPages || 1;
    const followerTotalPages = myFollowerData?.data?.meta?.totalPages || 1;
    const sentRequestTotalPages = sentRequestData?.data?.meta?.totalPages || 1;



    return (
        <div className="min-h-minus-header bg-gradient-to-br from-primary/15 via-primary/10 to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
            <PageLayout>
                <Tabs defaultValue="my-friends" className="w-full">
                    <div className="flex justify-between items-center mb-6">
                        <TabsList>
                            <TabsTrigger value="my-friends">{t('myFriends')}</TabsTrigger>
                            <TabsTrigger value="friend-request">{t('friendRequest')}</TabsTrigger>
                            <TabsTrigger value="sent-requests">{t('sentRequests')}</TabsTrigger>
                        </TabsList>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder={t('searchFriend')}
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
                                    <div className="col-span-full flex justify-center md:h-[60vh]">
                                        <LoadFailed msg={t("failedToLoadFriends")}/>
                                    </div>
                                ) : myFriends.length === 0 ? (
                                    <div className="col-span-full flex justify-center md:h-[60vh]">
                                        <NoData msg={t("noFriends")} />
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
                                    <div className="col-span-full flex justify-center md:h-[60vh]">
                                        <LoadFailed msg={t("failedToLoadFollowers")}/>
                                    </div>
                                ) : myFollower.length === 0 ? (
                                    <div className="col-span-full flex justify-center md:h-[60vh]">
                                        <NoData msg={t("noFollowers")} />
                                    </div>
                                ) : (
                                    myFollower?.map((follower) => (
                                        <FriendRequestCard key={follower._id} request={follower} />
                                    ))
                                )
                            }
                        </div>

                        {myFollower.length > 0 && followerTotalPages > 1 && (
                            <div className="my-4 absolute bottom-0 right-0 left-0">
                                <CustomPagination
                                    currentPage={currentPage}
                                    totalPages={followerTotalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="sent-requests">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {
                                isSentRequestLoading ? (
                                    <PeopleCardSkeleton count={12} />
                                ) : isSentRequestError ? (
                                    <div className="col-span-full flex justify-center md:h-[60vh]">
                                        <LoadFailed msg={t("failedToLoadSentRequests")}/>
                                    </div>
                                ) : sentRequests.length === 0 ? (
                                    <div className="col-span-full flex justify-center md:h-[60vh]">
                                        <NoData msg={t("noSentRequests")} />
                                    </div>
                                ) : (
                                    sentRequests?.map((request) => (
                                        <SentRequestCard key={request._id} request={request} />
                                    ))
                                )
                            }
                        </div>

                        {sentRequests.length > 0 && sentRequestTotalPages > 1 && (
                            <div className="my-4 absolute bottom-0 right-0 left-0">
                                <CustomPagination
                                    currentPage={currentPage}
                                    totalPages={sentRequestTotalPages}
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