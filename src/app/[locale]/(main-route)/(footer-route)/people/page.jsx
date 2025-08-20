"use client";

import React, { useState, } from "react";
import { useGetAllUsersQuery } from "@/lib/features/api/projectApi";
import { useSentRequestMutation } from "@/lib/features/api/friendsApi";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/components/common/CustomPagination";
import { Search } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import Title from "@/components/ui/Title";
import { toast } from "sonner";
import PeopleCardSkeleton from "@/components/skeleton/PeopleCardSkeleton";
import PeopleCard from "@/components/people/PeopleCard";

const PeoplePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);

    const { data, isLoading, isError } = useGetAllUsersQuery([
        { name: "page", value: currentPage },
        { name: "limit", value: pageSize },
        { name: "searchTerm", value: searchTerm },
    ]);

    const [sendFriendRequest, { isLoading: isSendingRequest }] = useSentRequestMutation();

    const users = data?.data?.result || [];
    const totalPages = data?.data?.meta?.totalPage || 1;

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleConnect = async (userObject) => {
        try {
            await sendFriendRequest({ receiver: userObject.user }).unwrap();
            toast.success("Friend request sent!");
        } catch (error) {
            toast.error(error.data?.message || "Failed to send friend request.");
        }
    };

    return (
        <div className="min-h-minus-header">
            <PageLayout>
                <div className="flex justify-between items-center">
                    <Title>Find People</Title>
                    <div className="relative mb-6 flex items-center space-x-4">
                        <Search className="h-4 w-4 text-muted-foreground absolute left-2" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="ps-10 w-40 md:w-50"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <PeopleCardSkeleton count={12} />
                    </div>
                ) : isError ? (
                    <p className="text-red-500 text-center">Error loading users.</p>
                ) : users.length === 0 ? (
                    <p className="text-muted-foreground text-center">No users found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {users.map((user) => (
                            <PeopleCard
                                key={user._id}
                                user={user}
                                handleConnect={handleConnect}
                                isSendingRequest={isSendingRequest}
                            />
                        ))}
                    </div>
                )}

                {users.length > 0 && totalPages > 1 && (
                    <div className="my-4 absolute bottom-0 right-0 left-0">
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </PageLayout>
        </div>
    );
};

export default PeoplePage;