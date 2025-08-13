"use client";

import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Pencil, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useGetSingleProjectQuery, useGetJoinRequestQuery, useAcceptRejectJoinRequestMutation, useGetProjectMemberQuery, useRemoveProjectMemberMutation } from "@/lib/features/api/projectApi";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import AddMemberModal from "@/components/objects/modal/AddMemberModal";
import { useState } from "react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
const ProjectDetailsPage = () => {
    const params = useParams();
    const projectId = params.id;

    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [memberTypeToAdd, setMemberTypeToAdd] = useState("Consumer"); // Default to Consumer

    const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);

    console.log(memberToRemove?._id);

    const [removeProjectMember, { isLoading: isRemovingMember }] = useRemoveProjectMemberMutation();

    const { data, isLoading, isError } = useGetSingleProjectQuery(projectId);


    const { data: producersData, isLoading: isProducersLoading, isError: isProducersError, refetch: refetchProducers } = useGetProjectMemberQuery({ id: projectId, type: "Producer" });
    const { data: consumersData, isLoading: isConsumersLoading, isError: isConsumersError, refetch: refetchConsumers } = useGetProjectMemberQuery({ id: projectId, type: "Consumer" });

    const refetchProjectMembers = () => { // Combined refetch for AddMemberModal
        refetchProducers();
        refetchConsumers();
    };

    // Callback for when a member is added
    const handleMemberAdded = () => {
        refetchProjectMembers();
    };



    const { data: joinRequestsData, isLoading: isJoinRequestsLoading, isError: isJoinRequestsError, refetch: refetchJoinRequests } = useGetJoinRequestQuery(projectId); // Added refetch

    const [acceptRejectJoinRequest, { isLoading: isAcceptingRejecting }] = useAcceptRejectJoinRequestMutation();

    const handleAcceptReject = async (requestId, status) => {
        try {
            await acceptRejectJoinRequest({ id: requestId, data: { status } }).unwrap();
            toast.success(`Request ${status} successfully!`);
            refetchJoinRequests(); // Refetch to update the list
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
                refetchProjectMembers(); // Refetch to update the list
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
                <div className="flex justify-center items-center min-h-minus-border">
                    <p>Loading project details...</p>
                </div>
            </PageLayout>
        );
    }

    if (isError) {
        return (
            <PageLayout>
                <div className="flex justify-center items-center min-h-minus-border">
                    <p className="text-red-500">Error loading project details.</p>
                </div>
            </PageLayout>
        );
    }

    const project = data?.data;

    if (!project) {
        return (
            <PageLayout>
                <div className="flex justify-center items-center min-h-minus-border">
                    <p>Project not found.</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div>
                {/* Header Image */}
                <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
                    <Image
                        src={project.cover_image || "/images/placeholder-image.jpg"}
                        alt={project.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>

                {/* Project Info Header */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                    <div className="w-full">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                        <div className="flex items-center space-x-2 mb-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={project.owner?.profile_image || "/images/placeholder-avatar.jpg"} />
                                <AvatarFallback>{project.owner?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <p className="text-gray-700 font-medium">{project.owner?.name || "Unknown"}</p>
                            <span className="text-gray-500 text-sm">Owner</span>
                        </div>
                        <p className="text-gray-700 mb-4">{project.description}</p>
                        <div className="flex items-center text-gray-600 text-sm">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{project.totalParticipate || 0} Participant</span>
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-end space-y-2">
                        <Button size="sm" variant="default" className="flex items-center gap-2">
                            <Pencil className="h-4 w-4" /> Edit Project
                        </Button>
                        <div className="flex flex-wrap justify-end gap-2">
                            <Badge variant="secondary">{project.status}</Badge>
                            <Badge variant="outline">{project.joinControll}</Badge>
                        </div>
                        <p className="text-gray-500 text-sm mt-2">{new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                </div>

                {/* Producers and Users Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Producers */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Producer</h2>
                            <Button size="sm" onClick={() => handleOpenAddMemberModal("Producer")}>+Add Producer</Button>
                        </div>
                        <div className="space-y-3">
                            {isProducersLoading ? (
                                <p>Loading producers...</p>
                            ) : isProducersError ? (
                                <p className="text-red-500">Error loading producers.</p>
                            ) : producersData?.data?.result?.length > 0 ? (
                                producersData.data.result.map((producer) => (
                                    <div key={producer._id} className="flex items-center justify-between p-3 border rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={producer.user?.profile_image || "/images/placeholder-avatar.jpg"} />
                                                <AvatarFallback>{producer.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{producer.user?.name || "Unknown"}</p>
                                                <p className="text-sm text-gray-500">{producer.role}</p>
                                            </div>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => handleOpenRemoveMemberModal(producer)} disabled={isRemovingMember}>Remove</Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No producers found.</p>
                            )}
                            {producersData?.data?.result?.length > 5 && (
                                <Button variant="link" className="p-0 h-auto">View all</Button>
                            )}
                        </div>
                    </div>

                    {/* Users */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">User</h2>
                            <Button size="sm" onClick={() => handleOpenAddMemberModal("Consumer")}>+Add User</Button>
                        </div>
                        <div className="space-y-3">
                            {isConsumersLoading ? (
                                <p>Loading users...</p>
                            ) : isConsumersError ? (
                                <p className="text-red-500">Error loading users.</p>
                            ) : consumersData?.data?.result?.length > 0 ? (
                                consumersData.data.result.map((user) => (
                                    <div key={user._id} className="flex items-center justify-between p-3 border rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.user?.profile_image || "/images/placeholder-avatar.jpg"} />
                                                <AvatarFallback>{user.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.user?.name || "Unknown"}</p>
                                                <p className="text-sm text-gray-500">{user.role || ""}</p>
                                            </div>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => handleOpenRemoveMemberModal(user)} disabled={isRemovingMember}>
                                            {isRemovingMember ? <><Loader2 className="animate-spin" />Removing</> : "Remove"}
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No users found.</p>
                            )}
                            {consumersData?.data?.result?.length > 5 && <Button variant="link" className="p-0 h-auto">View all</Button>}
                        </div>
                    </div>
                </div>

                {/* Join Requests Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Join Request</h2>
                    <div className="space-y-3">
                        {isJoinRequestsLoading ? (
                            <p>Loading join requests...</p>
                        ) : isJoinRequestsError ? (
                            <>
                                <p className="text-red-500">Error loading join requests.</p>
                            </>
                        ) : joinRequestsData?.data?.length > 0 ? (
                            joinRequestsData.data.map((request) => (
                                <div key={request._id} className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={request.user?.profile_image || "/images/placeholder-avatar.jpg"} />
                                            <AvatarFallback>{request.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{request.user?.name || "Unknown"}</p>
                                            <p className="text-sm text-gray-500">{request.user?.role || "User"}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleAcceptReject(request._id, "Rejected")}
                                            disabled={isAcceptingRejecting}
                                        >
                                            {isAcceptingRejecting ? <><Loader2 className="animate-spin" /> Processing</> : "Reject"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAcceptReject(request._id, "Approved")}
                                            disabled={isAcceptingRejecting}
                                        >
                                            {isAcceptingRejecting ? <><Loader2 className="animate-spin" /> Processing</> : "Accept"}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No pending join requests.</p>
                        )}
                    </div>
                </div>
            </div>
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
                confirmText={isRemovingMember ? <><Loader2 className="h-4 w-4 animate-spin" /> Removing</> : "Remove"}
            />
        </PageLayout>
    );
};

export default ProjectDetailsPage;