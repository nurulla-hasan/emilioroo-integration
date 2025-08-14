"use client";
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllProjectQuery } from '@/lib/features/api/projectApi';
import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CreateProjectModal from '@/components/objects/modal/CreateProjectModal';
import ProjectCard from '@/components/objects/all-projects/ProjectCard';
import CustomPagination from '@/components/common/CustomPagination';
import ProjectCardSkeleton from '@/components/skeleton/ProjectCardSkeleton';


const ObjectsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all-projects");

    

    const commonParams = [
        { name: "page", value: currentPage },
        { name: "limit", value: pageSize },
        { name: "searchTerm", value: searchTerm },
    ];

    // Define queries based on the activeTab
    const { data: allProjectsData, isLoading: allProjectsLoading, isError: allProjectsError } = useGetAllProjectQuery(commonParams, {
        skip: activeTab !== "all-projects",
    });

    const { data: myProjectsData, isLoading: myProjectsLoading, isError: myProjectsError } = useGetAllProjectQuery([...commonParams, { name: "myProject", value: true }], {
        skip: activeTab !== "my-projects",
    });

    const { data: joinedProjectsData, isLoading: joinedProjectsLoading, isError: joinedProjectsError } = useGetAllProjectQuery([...commonParams, { name: "joinProject", value: true }], {
        skip: activeTab !== "joined-projects",
    });

    // Use useMemo to select the correct data based on the activeTab
    const { data } = useMemo(() => {
        switch (activeTab) {
            case "all-projects":
                return { data: allProjectsData, isLoading: allProjectsLoading, isError: allProjectsError };
            case "my-projects":
                return { data: myProjectsData, isLoading: myProjectsLoading, isError: myProjectsError };
            case "joined-projects":
                return { data: joinedProjectsData, isLoading: joinedProjectsLoading, isError: joinedProjectsError };
            default:
                return { data: undefined, isLoading: false, isError: false };
        }
    }, [activeTab, allProjectsData, allProjectsLoading, allProjectsError, myProjectsData, myProjectsLoading, myProjectsError, joinedProjectsData, joinedProjectsLoading, joinedProjectsError]);

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

    return (
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
                    <Button className="w-full md:w-auto flex items-center gap-2" onClick={handleOpenCreateModal}>
                        <Plus />
                        Create Project
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all-projects" className="mt-12" onValueChange={(value) => {
                setActiveTab(value);
                setCurrentPage(1); // Reset page when tab changes
            }}> {/* Similar to InstitutionsPage */}
                <TabsList className="w-fit"> {/* Horizontal TabsList */}
                    <TabsTrigger value="all-projects">All Projects</TabsTrigger>
                    <TabsTrigger value="my-projects">My Projects</TabsTrigger>
                    <TabsTrigger value="joined-projects">Joined Projects</TabsTrigger>
                </TabsList>
                <TabsContent value="all-projects">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {allProjectsLoading ? (
                            <ProjectCardSkeleton count={12} />
                        ) : allProjectsError ? (
                            <p className="col-span-full text-center text-red-500">Failed to load projects.</p>
                        ) : allProjectsData?.data?.result?.length > 0 ? (
                            allProjectsData.data.result.map((project) => (
                                <ProjectCard key={project._id} project={project} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-muted-foreground">No projects found.</p>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="my-projects">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {myProjectsLoading ? (
                            <ProjectCardSkeleton count={12} />
                        ) : myProjectsError ? (
                            <p className="col-span-full text-center text-red-500">Failed to load my projects.</p>
                        ) : myProjectsData?.data?.result?.length > 0 ? (
                            myProjectsData.data.result.map((project) => (
                                <ProjectCard key={project._id} project={project} isMyOrJoinedProject={true} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-muted-foreground">No my projects found.</p>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="joined-projects">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {joinedProjectsLoading ? (
                            <ProjectCardSkeleton count={12} />
                        ) : joinedProjectsError ? (
                            <p className="col-span-full text-center text-red-500">Failed to load joined projects.</p>
                        ) : joinedProjectsData?.data?.result?.length > 0 ? (
                            joinedProjectsData.data.result.map((project) => (
                                <ProjectCard key={project._id} project={project} isMyOrJoinedProject={true} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-muted-foreground">No joined projects found.</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {totalPages > 1 && (
                <CustomPagination
                    currentPage={currentPage}
                    totalPage={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            
        </PageLayout>
    );
};

export default ObjectsPage;