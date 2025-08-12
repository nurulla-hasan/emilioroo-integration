"use client";
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { useGetAllObjectsQuery } from '@/lib/features/api/objectApi';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

const ObjectsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    // const [searchTerm, setSearchTerm] = useState("");
    // const [currentPage, setCurrentPage] = useState(1);
    // const [pageSize] = useState(12);
    // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // const { data, isLoading, isError } = useGetAllObjectsQuery([
    //     { name: "page", value: currentPage },
    //     { name: "limit", value: pageSize },
    //     { name: "searchTerm", value: searchTerm },
    // ]);

    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //         setSearchTerm(searchQuery);
    //         setCurrentPage(1)
    //     }, 600);

    //     return () => clearTimeout(timeoutId);
    // }, [searchQuery])

    // const totalPages = Math.ceil((data?.data?.meta?.total || 0) / pageSize) || 1;

    // const handleOpenCreateModal = () => {
    //     setIsCreateModalOpen(true);
    // };

    return (
        <div className='min-h-minus-header'>
            <PageLayout>
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-xl md:text-2xl font-bold text-primary mb-4 md:mb-0 dark:text-white">Cocreate your products</h1>
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
                        <Button className="w-full md:w-auto flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create New Project
                        </Button>
                    </div>
                </div>
            </PageLayout>
        </div>
    );
};

export default ObjectsPage;