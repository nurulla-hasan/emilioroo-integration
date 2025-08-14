"use client";

import PageLayout from "@/components/layout/PageLayout";
import { Loader2 } from "lucide-react";
import {
    useGetSingleProjectQuery,
    useGetJoinRequestQuery,
    useAcceptRejectJoinRequestMutation,
    useGetProjectMemberQuery,
    useRemoveProjectMemberMutation
} from "@/lib/features/api/projectApi";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import AddMemberModal from "@/components/objects/modal/AddMemberModal";
import { useState } from "react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import ProjectHeader from "@/components/objects/single-projects/ProjectHeader";
import MembersList from "@/components/objects/single-projects/MembersList";
import JoinRequests from "@/components/objects/single-projects/JoinRequests";

const ProjectDetailsPage = () => {
    const params = useParams();
    const projectId = params.id;

    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [memberTypeToAdd, setMemberTypeToAdd] = useState("Consumer");

    const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);

    const [removeProjectMember, { isLoading: isRemovingMember }] = useRemoveProjectMemberMutation();
    const { data, isLoading, isError } = useGetSingleProjectQuery(projectId);

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
        refetch: refetchJoinRequests
    } = useGetJoinRequestQuery(projectId);

    const [acceptRejectJoinRequest, { isLoading: isAcceptingRejecting }] = useAcceptRejectJoinRequestMutation();

    const handleAcceptReject = async (requestId, status) => {
        try {
            await acceptRejectJoinRequest({ id: requestId, data: { status } }).unwrap();
            toast.success(`Request ${status} successfully!`);
            refetchJoinRequests();
        } catch (err) {
            toast.error(err?.data?.message || `Failed to ${status.toLowerCase()} request.`);
        }
    };

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

    if (isLoading) {
        return (
            <PageLayout>
                <div className="flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </PageLayout>
        );
    }

    if (isError) {
        return (
            <PageLayout>
                <div className="flex justify-center items-center">
                    <p className="text-red-500">Error loading project details.</p>
                </div>
            </PageLayout>
        );
    }

    const project = data?.data;

    if (!project) {
        return (
            <PageLayout>
                <div className="flex justify-center items-center">
                    <p>Project not found.</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <ProjectHeader project={project} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <MembersList
                    title="Producers"
                    members={producersData?.data?.result}
                    isLoading={isProducersLoading}
                    isError={isProducersError}
                    onAddMember={() => handleOpenAddMemberModal("Producer")}
                    onRemoveMember={handleOpenRemoveMemberModal}
                    isRemovingMember={isRemovingMember}
                />
                <MembersList
                    title="Consumers"
                    members={consumersData?.data?.result}
                    isLoading={isConsumersLoading}
                    isError={isConsumersError}
                    onAddMember={() => handleOpenAddMemberModal("Consumer")}
                    onRemoveMember={handleOpenRemoveMemberModal}
                    isRemovingMember={isRemovingMember}
                />
            </div>

            <JoinRequests
                requests={joinRequestsData?.data}
                isLoading={isJoinRequestsLoading}
                isError={isJoinRequestsError}
                onAcceptReject={handleAcceptReject}
                isProcessing={isAcceptingRejecting}
            />

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
                description={`Are you sure you want to remove ${memberToRemove?.user?.name || "this member"}?`}
                onConfirm={handleConfirmRemoveMember}
                confirmText={isRemovingMember ? "Removing..." : "Remove"}
            />
        </PageLayout>
    );
};

export default ProjectDetailsPage;
