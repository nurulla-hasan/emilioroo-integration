"use client";

import PageLayout from "@/components/layout/PageLayout";
import {
    useGetSingleProjectQuery,
    useGetJoinRequestQuery,
    useGetProjectMemberQuery,
    useRemoveProjectMemberMutation
} from "@/lib/features/api/projectApi";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import AddMemberModal from "@/components/objects/modal/AddMemberModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import ProjectHeader from "@/components/objects/single-projects/ProjectHeader";
import MembersList from "@/components/objects/single-projects/MembersList";
import JoinRequests from "@/components/objects/single-projects/JoinRequests";
import UpdateProjectModal from "@/components/objects/modal/UpdateProjectModal";
import { useState } from "react";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb";
import NoData from "@/components/common/NoData";
import LoadFailed from "@/components/common/LoadFailed";
import ProjectDetailsPageSkeleton from "@/components/skeleton/ProjectDetailsPageSkeleton";

const ProjectDetailsPage = () => {
    const params = useParams();
    const projectId = params.id;

    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [memberTypeToAdd, setMemberTypeToAdd] = useState("Consumer");

    const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);

    const [isUpdateProjectModalOpen, setIsUpdateProjectModalOpen] = useState(false);

    const [removeProjectMember, { isLoading: isRemovingMember }] = useRemoveProjectMemberMutation();
    const { data, isLoading, isError } = useGetSingleProjectQuery(projectId);
    const project = data?.data;

    const {
        data: producersData,
        isLoading: isProducersLoading,
        isError: isProducersError,
        refetch: refetchProducers
    } = useGetProjectMemberQuery({ id: projectId, type: "Producer" });

    const {
        data: consumersData,
        isLoading: isConsumersLoading,
        isError: isConsumersError,
        refetch: refetchConsumers
    } = useGetProjectMemberQuery({ id: projectId, type: "Consumer" });

    const refetchProjectMembers = () => {
        refetchProducers();
        refetchConsumers();
    };

    const handleMemberAdded = () => {
        refetchProjectMembers();
    };

    const {
        data: joinRequestsData,
        isLoading: isJoinRequestsLoading,
        isError: isJoinRequestsError,
    } = useGetJoinRequestQuery(projectId);

    const handleOpenAddMemberModal = (type) => {
        setMemberTypeToAdd(type);
        setIsAddMemberModalOpen(true);
    };

    const handleOpenRemoveMemberModal = (member) => {
        setMemberToRemove(member);
        setIsRemoveMemberModalOpen(true);
    };

    const handleConfirmRemoveMember = async () => {
        if (memberToRemove) {
            try {
                await removeProjectMember(memberToRemove._id).unwrap();
                toast.success("Member removed successfully!");
                refetchProjectMembers();
                setIsRemoveMemberModalOpen(false);
                setMemberToRemove(null);
            } catch (err) {
                toast.error(err?.data?.message || "Failed to remove member.");
            }
        }
    };


    const breadcrumbLinks = [
        { name: "Home", href: "/" },
        { name: "Objects", href: "/objects" },
        { name: "Project Details", isCurrent: true },
    ];

    return (
        <div className="min-h-minus-header">
            <PageLayout>
                {isLoading ? (
                    <ProjectDetailsPageSkeleton />
                ) : isError ? (
                    <LoadFailed />
                ) : !project ? (
                    <NoData msg="Project not found." />
                ) : (
                    <>
                        <CustomBreadcrumb links={breadcrumbLinks} />
                        <ProjectHeader
                            project={project}
                            onEditProject={() => setIsUpdateProjectModalOpen(true)}
                        />
                        <div className="border rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <MembersList
                                    project={project}
                                    title="Producers"
                                    members={producersData?.data?.result}
                                    isLoading={isProducersLoading}
                                    isError={isProducersError}
                                    onAddMember={() => handleOpenAddMemberModal("Producer")}
                                    onRemoveMember={handleOpenRemoveMemberModal}
                                    isRemovingMember={isRemovingMember}
                                />
                                <MembersList
                                    project={project}
                                    title="Consumers"
                                    members={consumersData?.data?.result}
                                    isLoading={isConsumersLoading}
                                    isError={isConsumersError}
                                    onAddMember={() => handleOpenAddMemberModal("Consumer")}
                                    onRemoveMember={handleOpenRemoveMemberModal}
                                    isRemovingMember={isRemovingMember}
                                />
                            </div>

                            {project?.isOwner && (
                                <JoinRequests
                                    requests={joinRequestsData?.data}
                                    isLoading={isJoinRequestsLoading}
                                    isError={isJoinRequestsError}
                                />
                            )}

                            <AddMemberModal
                                isOpen={isAddMemberModalOpen}
                                onOpenChange={setIsAddMemberModalOpen}
                                projectId={projectId}
                                memberType={memberTypeToAdd}
                                onMemberAdded={handleMemberAdded}
                            />
                            <ConfirmationModal
                                isOpen={isRemoveMemberModalOpen}
                                onOpenChange={setIsRemoveMemberModalOpen}
                                title="Remove Member"
                                description={`Are you sure you want to remove ${memberToRemove?.user?.name || "this member"
                                    }?`}
                                onConfirm={handleConfirmRemoveMember}
                                confirmText="Remove"
                                loading={isRemovingMember}
                            />
                            <UpdateProjectModal
                                isOpen={isUpdateProjectModalOpen}
                                onOpenChange={setIsUpdateProjectModalOpen}
                                project={project}
                            />
                        </div>
                    </>
                )}
            </PageLayout>
        </div>
    );
};

export default ProjectDetailsPage;
