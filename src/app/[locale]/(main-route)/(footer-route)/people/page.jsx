"use client";

import React, { useState, } from "react";
import { useGetAllUsersQuery } from "@/lib/features/api/projectApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomPagination from "@/components/common/CustomPagination";
import { Card, } from "@/components/ui/card";
import { Search } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import Title from "@/components/ui/Title";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const PeoplePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);

    const { data, isLoading, isError } = useGetAllUsersQuery([
        { name: "page", value: currentPage },
        { name: "limit", value: pageSize },
        { name: "searchTerm", value: searchTerm },
    ]);

    const users = data?.data?.result || [];
    const totalPages = data?.data?.meta?.totalPage || 1;

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

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(pageSize)].map((_, index) => (
                            <Card key={index} className="flex flex-col items-center p-4">
                                <Avatar className="h-24 w-24 mb-4">
                                    <AvatarFallback></AvatarFallback>
                                </Avatar>
                                <div className="text-center flex flex-col justify-center items-center">
                                    <Skeleton className="h-6 w-32 rounded mb-2"></Skeleton>
                                    <Skeleton className="h-4 w-48 rounded"></Skeleton>
                                </div>
                                <Button className="mt-4 w-full" disabled>Connect</Button>
                            </Card>
                        ))}
                    </div>
                ) : isError ? (
                    <p className="text-red-500 text-center">Error loading users.</p>
                ) : users.length === 0 ? (
                    <p className="text-muted-foreground text-center">No users found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {users.map((user) => (
                            <Card key={user._id} className="flex flex-col items-center p-4">
                                <Avatar className="h-24 w-24 mb-4">
                                    <AvatarImage src={user.profile_image} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h2 className="text-lg font-semibold">{user.name}</h2>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <div className="flex mt-4 w-full gap-2">
                                    <Button className="flex-1">Connect</Button>
                                    <Link href={`/profile/${user._id}`} className="flex-1">
                                        <Button variant="outline" className="w-full">View Profile</Button>
                                    </Link>
                                </div>
                            </Card>
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
