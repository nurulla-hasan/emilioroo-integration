// "use client";
// import PageLayout from '@/components/layout/PageLayout';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useGetAllProjectQuery } from '@/lib/features/api/projectApi';
// import { Plus, Search } from 'lucide-react';
// import { useEffect, useMemo, useState } from 'react';
// import CreateProjectModal from '@/components/objects/modal/CreateProjectModal';
// import ProjectCard from '@/components/objects/all-projects/ProjectCard';
// import CustomPagination from '@/components/common/CustomPagination';
// import ProjectCardSkeleton from '@/components/skeleton/ProjectCardSkeleton';
// import LoadFailed from '@/components/common/LoadFailed';
// import { useTranslations } from "next-intl";
// import NoData from '@/components/common/NoData';
// import CustomBreadcrumb from '@/components/common/CustomBreadcrumb';


// const ObjectsPage = () => {
//     const t = useTranslations('Objects');
//     const [searchQuery, setSearchQuery] = useState("");
//     const [searchTerm, setSearchTerm] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize] = useState(12);
//     const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//     const [activeTab, setActiveTab] = useState("all-projects");



//     const commonParams = [
//         { name: "page", value: currentPage },
//         { name: "limit", value: pageSize },
//         { name: "searchTerm", value: searchTerm },
//     ];

//     // Define queries based on the activeTab
//     const { data: allProjectsData, isLoading: allProjectsLoading, isError: allProjectsError } = useGetAllProjectQuery(commonParams, {
//         skip: activeTab !== "all-projects",
//     });

//     const { data: myProjectsData, isLoading: myProjectsLoading, isError: myProjectsError } = useGetAllProjectQuery([...commonParams, { name: "myProject", value: true }], {
//         skip: activeTab !== "my-projects",
//     });

//     const { data: joinedProjectsData, isLoading: joinedProjectsLoading, isError: joinedProjectsError } = useGetAllProjectQuery([...commonParams, { name: "joinProject", value: true }], {
//         skip: activeTab !== "joined-projects",
//     });

//     // Use useMemo to select the correct data based on the activeTab
//     const { data } = useMemo(() => {
//         switch (activeTab) {
//             case "all-projects":
//                 return { data: allProjectsData, isLoading: allProjectsLoading, isError: allProjectsError };
//             case "my-projects":
//                 return { data: myProjectsData, isLoading: myProjectsLoading, isError: myProjectsError };
//             case "joined-projects":
//                 return { data: joinedProjectsData, isLoading: joinedProjectsLoading, isError: joinedProjectsError };
//             default:
//                 return { data: undefined, isLoading: false, isError: false };
//         }
//     }, [activeTab, allProjectsData, allProjectsLoading, allProjectsError, myProjectsData, myProjectsLoading, myProjectsError, joinedProjectsData, joinedProjectsLoading, joinedProjectsError]);

//     const allProject = data?.data?.result;
//     const myProject = myProjectsData?.data?.result;
//     const joinedProject = joinedProjectsData?.data?.result;

//     useEffect(() => {
//         const timeoutId = setTimeout(() => {
//             setSearchTerm(searchQuery);
//             setCurrentPage(1)
//         }, 600);

//         return () => clearTimeout(timeoutId);
//     }, [searchQuery])

//     const totalPages = data?.data?.meta?.totalPage;

//     const handleOpenCreateModal = () => {
//         setIsCreateModalOpen(true);
//     };

//     const breadcrumbLinks = [
//         { name: 'Home', href: '/' },
//         { name: 'Objects', href: '/objects', isCurrent: true },
//     ]

//     return (
//         <div className="min-h-minus-header">
//             <PageLayout>
//                 <CustomBreadcrumb links={breadcrumbLinks} />
//                 <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
//                     <h1 className="text-xl md:text-2xl font-bold text-primary dark:text-white">
//                         {t('cocreateProducts')}
//                     </h1>
//                     <div className="flex items-center gap-4">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                             <Input
//                                 placeholder={t('searchProject')}
//                                 className="pl-9"
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                             />
//                         </div>
//                         <Button className="w-fit" onClick={handleOpenCreateModal}>
//                             <Plus />
//                             {t('createProject')}
//                         </Button>
//                     </div>
//                 </div>

//                 <Tabs defaultValue="all-projects" className="mt-8" onValueChange={(value) => { setActiveTab(value); setCurrentPage(1); }}>
//                     <TabsList className="w-fit">
//                         <TabsTrigger value="all-projects">{t('allProjects')}</TabsTrigger>
//                         <TabsTrigger value="my-projects">{t('myProjects')}</TabsTrigger>
//                         <TabsTrigger value="joined-projects">{t('joinedProjects')}</TabsTrigger>
//                     </TabsList>
//                     <TabsContent value="all-projects">
//                         <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                             {allProjectsLoading ? (
//                                 <ProjectCardSkeleton count={12} />
//                             ) : allProjectsError ? (
//                                 <LoadFailed />
//                             ) : allProject?.length === 0 ? (
//                                 <NoData msg={t('noProjectsFound')} />
//                             ) : (
//                                 allProject?.map((project) => (
//                                     <ProjectCard
//                                         key={project._id}
//                                         project={project} />
//                                 ))
//                             )}
//                         </div>
//                     </TabsContent>

//                     <TabsContent value="my-projects">
//                         <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                             {myProjectsLoading ? (
//                                 <ProjectCardSkeleton count={12} />
//                             ) : myProjectsError ? (
//                                 <LoadFailed />
//                             ) : myProject?.length === 0 ? (
//                                 <NoData msg={t('noMyProjectsFound')} />
//                             ) : (
//                                 myProject?.map((project) => (
//                                     <ProjectCard
//                                         key={project._id}
//                                         project={project}
//                                         isMyOrJoinedProject={true}
//                                     />
//                                 ))
//                             )}
//                         </div>
//                     </TabsContent>

//                     <TabsContent value="joined-projects">
//                         <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                             {joinedProjectsLoading ? (
//                                 <ProjectCardSkeleton count={12} />
//                             ) : joinedProjectsError ? (
//                                 <LoadFailed />
//                             ) : joinedProject?.length === 0 ? (
//                                 <NoData msg={t('noJoinedProjectsFound')} />
//                             ) : (
//                                 joinedProject?.map((project) => (
//                                     <ProjectCard
//                                         key={project._id}
//                                         project={project}
//                                         isMyOrJoinedProject={true}
//                                     />
//                                 ))
//                             )}
//                         </div>
//                     </TabsContent>
//                 </Tabs>

//                 <div className='my-4 absolute bottom-0 right-0 left-0'>
//                     {totalPages > 1 && (
//                         <CustomPagination
//                             currentPage={currentPage}
//                             totalPage={totalPages}
//                             onPageChange={setCurrentPage}
//                         />
//                     )}
//                 </div>

//                 <CreateProjectModal
//                     isOpen={isCreateModalOpen}
//                     onOpenChange={setIsCreateModalOpen}
//                 />


//             </PageLayout>
//         </div>
//     );
// };

// export default ObjectsPage;