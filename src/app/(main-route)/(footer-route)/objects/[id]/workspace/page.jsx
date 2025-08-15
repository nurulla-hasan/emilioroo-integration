"use client";

import React from 'react';
import { useParams } from "next/navigation";
import { useGetAllProjectQuery } from "@/lib/features/api/projectApi";
import InstitutionNavCardSkeleton from "@/components/skeleton/InstitutionNavCardSkeleton";
import ProjectNavCard from "@/components/objects/single-projects/ProjectNavCard";


const ProjectWorkspacePage = () => {
    const params = useParams();
    const projectId = params.id;

    const { data: allProjectsData, isLoading: areAllProjectsLoading, isError: areAllProjectsError } = useGetAllProjectQuery();

    const allProjects = allProjectsData?.data?.result;

    console.log(allProjects);

    return (
        <div className="min-h-minus-header overflow-hidden grid grid-cols-12 gap-8 p-2">
            {/* Sidebar */}
            <div className="hidden lg:block col-span-3 border rounded-lg p-4 overflow-y-auto">
                <div className="flex flex-col gap-2">
                    {areAllProjectsLoading && <InstitutionNavCardSkeleton count={7} />}
                    {areAllProjectsError && <p className="text-red-500">Error loading projects.</p>}
                    {allProjects && allProjects.map(proj => (
                        <ProjectNavCard key={proj._id} project={proj} isActive={proj._id === projectId} />
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="col-span-12 lg:col-span-9 overflow-y-auto border p-3 rounded-lg">
                <div className="h-full border-2 border-dashed rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Workspace for Project ID: {projectId}</h1>
                    <p className="text-muted-foreground">This is the main content area for the project workspace. You can add your components and content here.</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectWorkspacePage;