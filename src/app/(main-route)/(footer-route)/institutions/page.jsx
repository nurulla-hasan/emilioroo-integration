"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllInstitutionQuery } from "@/lib/features/api/InstitutionApi";
import { useEffect, useState } from "react";
import CustomPagination from "@/components/common/CustomPagination";
import AllInstitutionsCard from "@/components/institutions/all-institutions/AllInstitutionsCard";
import MyInstitutionsTabs from "@/components/institutions/my-institutions/MyInstitutionsTabs";
import CardSkeleton from "@/components/common/CardSkeleton";
import CreateInstitutionModal from "@/components/institutions/CreateInstitutionModal";

const InstitutionsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for modal visibility

    const { data, isLoading, isError } = useGetAllInstitutionQuery([
        { name: "page", value: currentPage },
        { name: "limit", value: pageSize },
        { name: "searchTerm", value: searchTerm },
    ]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchTerm(searchQuery);
            setCurrentPage(1)
        }, 600);

        return () => clearTimeout(timeoutId);
    }, [searchQuery])

    const totalPages = data?.data?.meta?.totalPage || 1;

    return (
        <div className="min-h-minus-header">
            <PageLayout>
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-xl md:text-2xl font-bold text-primary mb-4 md:mb-0">Be part of it</h1>
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                        <div className="relative w-full md:w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search Project"
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button className="w-full md:w-auto flex items-center gap-2" onClick={() => setIsCreateModalOpen(true)}> {/* Open modal on click */}
                            <Plus className="h-4 w-4" />
                            Create Institution
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="all-institutions" className="mt-12">
                    <TabsList className="w-fit">
                        <TabsTrigger value="all-institutions" className="data-[state=active]:bg-primary data-[state=active]:text-white">All Institutions</TabsTrigger>
                        <TabsTrigger value="my-institutions" className="data-[state=active]:bg-primary data-[state=active]:text-white">My Institutions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all-institutions">
                        <div className="mt-4">
                            {isLoading && (
                                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {[...Array(pageSize)].map((_, index) => (
                                        <CardSkeleton key={index} />
                                    ))}
                                </div>
                            )}
                            {isError && <p className="text-red-500">Error loading institutions.</p>}
                            {!isLoading && !isError && data?.data?.result?.length === 0 && (
                                <p>No institutions found.</p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {!isLoading && !isError && data?.data?.result?.map((institution) => (
                                    <AllInstitutionsCard key={institution._id} institution={institution} />
                                ))}
                            </div>
                            {!isLoading && !isError && data?.data?.result?.length > pageSize && (
                                <CustomPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="my-institutions">
                        <MyInstitutionsTabs searchTerm={searchTerm} />
                    </TabsContent>
                </Tabs>

            </PageLayout>

            <CreateInstitutionModal
                isOpen={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />
        </div>
    );
};

export default InstitutionsPage;