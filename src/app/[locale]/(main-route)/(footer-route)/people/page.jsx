"use client";

import React, { useState, } from "react";
// import { useGetAllUsersQuery } from "@/lib/features/api/projectApi";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/components/common/CustomPagination";
import { Search } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import Title from "@/components/ui/Title";
import PeopleCardSkeleton from "@/components/skeleton/PeopleCardSkeleton";
import PeopleCard from "@/components/people/PeopleCard";
import LoadFailed from "@/components/common/LoadFailed";
// import { useGetMe } from "@/hooks/useGetMe";
import { useGetUsersWithoutMe } from "@/hooks/useGetUsersWithoutMe";

const PeoplePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);

    const { users, isLoading, isError, totalPages} = useGetUsersWithoutMe(currentPage, pageSize, searchTerm);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {isLoading ? (
                        <PeopleCardSkeleton count={12} />
                    ) : isError ? (
                        <div className="col-span-full mx-auto mt-20"><LoadFailed /></div>
                    ) : users.length === 0 ? (
                        <p className="text-muted-foreground text-center col-span-full mt-20">No users found.</p>
                    ) : (
                        users.map((user) => (
                            <PeopleCard
                                key={user._id}
                                user={user}
                            />
                        ))
                    )}
                </div>

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