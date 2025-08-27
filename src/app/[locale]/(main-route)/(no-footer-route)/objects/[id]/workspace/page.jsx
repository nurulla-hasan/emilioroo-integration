"use client";

import React from 'react';
import { useParams } from "next/navigation";
import { useGetAllProjectQuery, useGetSingleProjectQuery, useGetProjectMemberQuery, useGetProjectDocumentQuery, useGetProjectImageQuery } from "@/lib/features/api/projectApi";
import InstitutionNavCardSkeleton from "@/components/skeleton/InstitutionNavCardSkeleton";
import ProjectNavCard from "@/components/objects/single-projects/ProjectNavCard";
import ProjectWorkspaceHeader from "@/components/objects/workspace/ProjectWorkspaceHeader";
import ProducersList from "@/components/objects/workspace/ProducersList";
import UsersList from "@/components/objects/workspace/UsersList";
import FilesSection from "@/components/objects/workspace/FilesSection";
import ProjectDiscussion from "@/components/objects/workspace/ProjectDiscussion";
import CustomBreadcrumb from '@/components/common/CustomBreadcrumb';
import ProjectWorkspaceSkeleton from "@/components/skeleton/ProjectWorkspaceSkeleton";
import LoadFailed from '@/components/common/LoadFailed';
import NoData from '@/components/common/NoData';

const staticMessages = [
  { id: 1, author: { name: "Dindiniya", role: "General manager", avatar: "" }, text: "Hlw jhon, how can i help you??", time: "9:30", isYou: false },
  { id: 2, author: { name: "You", role: "", avatar: "" }, text: "Hlw jhon, how can i help you??", time: "9:30", isYou: true },
  { id: 3, author: { name: "Dindiniya", role: "General manager", avatar: "" }, text: "Hlw jhon, how can i help you??", time: "9:30", isYou: false },
  { id: 4, author: { name: "You", role: "", avatar: "" }, text: "Hlw jhon, how can i help you??", time: "9:30", isYou: true },
];


const ProjectWorkspacePage = () => {
  const params = useParams();
  const projectId = params.id;

  const { data: allProjectsData, isLoading: areAllProjectsLoading, isError: areAllProjectsError } = useGetAllProjectQuery();
  const { data: singleProjectData, isLoading: isSingleProjectLoading, isError: isSingleProjectError } = useGetSingleProjectQuery(projectId);
  const { data: producersData, isLoading: areProducersLoading, isError: areProducersError } = useGetProjectMemberQuery({ id: projectId, type: "Producer" });
  const { data: consumersData, isLoading: areConsumersLoading, isError: areConsumersError } = useGetProjectMemberQuery({ id: projectId, type: "Consumer" });
  const { data: documentsData, isLoading: areDocumentsLoading, isError: areDocumentsError } = useGetProjectDocumentQuery(projectId);
  const { data: imagesData, isLoading: areImagesLoading, isError: areImagesError } = useGetProjectImageQuery(projectId);


  const allProjects = allProjectsData?.data?.result;
  const project = singleProjectData?.data;
  const producers = producersData?.data?.result;
  const consumers = consumersData?.data?.result;
  const documents = documentsData?.data?.result;
  const images = imagesData?.data?.result;

  const breadcrumbLinks = [
    { name: "Home", href: "/" },
    { name: "Objects", href: "/objects" },
    { name: "Project Details", href: `/objects/${projectId}` },
    { name: "Workspace", href: `/objects/${projectId}/workspace`, isCurrent: true },
  ];

  return (
    <>
      <div className='mt-2 ml-2 hidden md:block'> <CustomBreadcrumb links={breadcrumbLinks} /></div>
      <div className="h-[calc(100vh-108px)] md:-mt-4 overflow-hidden grid grid-cols-12 gap-8 p-2">
        {/* Sidebar */}
        <div className="hidden xl:block col-span-3 border rounded-lg p-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {areAllProjectsLoading && <InstitutionNavCardSkeleton count={7} />}
            {areAllProjectsError && <p className="text-red-500">Error loading projects.</p>}
            {allProjects && allProjects.map(proj => (
              <ProjectNavCard key={proj._id} project={proj} isActive={proj._id === projectId} />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="col-span-12 xl:col-span-9 overflow-y-auto border p-3 rounded-lg">
          {isSingleProjectLoading ? (
            <ProjectWorkspaceSkeleton />
          ) : isSingleProjectError ? (
            <div className="h-[60vh] flex items-center justify-center">
              <LoadFailed msg="Error loading project." />
            </div>
          ) : !project ? (
            <div className="h-[60vh] flex items-center justify-center text-muted-foreground">
              <NoData msg="Project not found." />
            </div>
          ) : (
            <>
              <ProjectWorkspaceHeader project={project} />
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="lg:col-span-3">
                  <ProducersList
                    producers={producers}
                    isLoading={areProducersLoading}
                    isError={areProducersError}
                  />
                </div>
                <div className="lg:col-span-6">
                  <FilesSection
                    project={project}
                    documents={documents}
                    images={images}
                    isLoadingDocuments={areDocumentsLoading}
                    isErrorDocuments={areDocumentsError}
                    isLoadingImages={areImagesLoading}
                    isErrorImages={areImagesError}
                  />
                </div>
                <div className="lg:col-span-3">
                  <UsersList
                    users={consumers}
                    isLoading={areConsumersLoading}
                    isError={areConsumersError}
                  />
                </div>
              </div>
              <ProjectDiscussion messages={staticMessages} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectWorkspacePage;
