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
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import CreateInstitutionModal from "@/components/institutions/modal/CreateInstitutionModal";
import UpdateInstitutionModal from "@/components/institutions/modal/UpdateInstitutionModal";
import { useTranslations } from "next-intl";

const InstitutionsPage = () => {
    const t = useTranslations('Institutions');
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12); 
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [editingInstitution, setEditingInstitution] = useState(null); 

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

    const totalPages = Math.ceil((data?.data?.meta?.total || 0) / pageSize) || 1;

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (institution) => {
        setEditingInstitution(institution);
        setIsUpdateModalOpen(true);
    };

    return (
        <div className="min-h-minus-header">
            <PageLayout>
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-xl md:text-2xl font-bold text-primary mb-4 md:mb-0 dark:text-white">{t('bePartOfIt')}</h1>
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                        <div className="relative w-full md:w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t('searchInstitution')}
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button className="w-full md:w-auto flex items-center gap-2" onClick={handleOpenCreateModal}> 
                            <Plus className="h-4 w-4" />
                            {t('createInstitution')}
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="all-institutions" className="mt-12">
                    <TabsList className="w-fit">
                        <TabsTrigger value="all-institutions">{t('allInstitutions')}</TabsTrigger>
                        <TabsTrigger value="my-institutions">{t('myInstitutions')}</TabsTrigger>
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
                            {isError && <p className="text-red-500">{t('errorFetchingInstitutions')}</p>}
                            {!isLoading && !isError && data?.data?.result?.length === 0 && (
                                <p>{t('noInstitutionsFound')}</p>
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
                        <MyInstitutionsTabs searchTerm={searchTerm} onEditInstitution={handleOpenEditModal} /> 
                    </TabsContent>
                </Tabs>

            </PageLayout>

            <CreateInstitutionModal
                isOpen={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <UpdateInstitutionModal
                isOpen={isUpdateModalOpen}
                onOpenChange={setIsUpdateModalOpen}
                institution={editingInstitution}
            />
        </div>
    );
};

export default InstitutionsPage;