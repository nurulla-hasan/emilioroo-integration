"use client";

import React, { useState, } from "react";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/components/common/CustomPagination";
import { Search } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import Title from "@/components/ui/Title";
import PeopleCardSkeleton from "@/components/skeleton/PeopleCardSkeleton";
import PeopleCard from "@/components/people/PeopleCard";
import LoadFailed from "@/components/common/LoadFailed";
import { useGetUsersWithoutMe } from "@/hooks/useGetUsersWithoutMe";
import NoData from "@/components/common/NoData";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb";

const PeoplePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);

    const { users, isLoading, isError, totalPages } = useGetUsersWithoutMe(currentPage, pageSize, searchTerm);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const breadcrumbLinks = [
        { name: 'Home', href: '/' },
        { name: 'People', href: '/people', isCurrent: true },
    ]

    return (
        <div className="min-h-minus-header">
            <PageLayout>
                <CustomBreadcrumb links={breadcrumbLinks} />
                <div className="flex justify-between items-center mb-6 mt-4">
                    <Title>Find People</Title>
                    <div className="relative flex items-center space-x-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {isLoading ? (
                        <PeopleCardSkeleton count={12} />
                    ) : isError ? (
                            <LoadFailed msg={"Failed to load users."} />
                    ) : users.length === 0 ? (
                            <NoData msg={"No users found."} />
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