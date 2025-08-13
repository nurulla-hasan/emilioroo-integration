"use client";

import PageLayout from "@/components/layout/PageLayout";
import { useParams } from "next/navigation";

const ProjectWorkspacePage = () => {
  const params = useParams();
  const projectId = params.id;

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Workspace for Project ID: {projectId}</h1>
        <p className="text-gray-700">This is where the project workspace content will go.</p>
        {/* You would typically fetch and display workspace-specific data here */}
      </div>
    </PageLayout>
  );
};

export default ProjectWorkspacePage;