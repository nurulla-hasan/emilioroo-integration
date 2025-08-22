"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetProjectMemberQuery, useGetSingleProjectQuery, useSendJoinRequestMutation } from "@/lib/features/api/projectApi"
import { toast } from "sonner"
import { fallbackAvatar, getInitials } from "@/lib/utils"

export default function ProjectDetailsModal({ isOpen, onOpenChange, projectId }) {
    const { data: projectData, isLoading: isProjectLoading, isError: isProjectError } = useGetSingleProjectQuery(projectId);
    const { data: producersData, isLoading: isProducersLoading, isError: isProducersError } = useGetProjectMemberQuery({ id: projectId, type: "Producer" });
    const { data: consumersData, isLoading: isConsumersLoading, isError: isConsumersError } = useGetProjectMemberQuery({ id: projectId, type: "Consumer" });
    const [sendJoinRequest, { isLoading: isSendingRequest }] = useSendJoinRequestMutation();
    const project = projectData?.data;

    const handleSendJoinRequest = async () => {
        try {
            await sendJoinRequest(projectId).unwrap();
            toast.success("Join request sent successfully!");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to send join request.");
        }
    };

    if (isProjectLoading) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] min-h-96 overflow-hidden p-0 border">
                    <DialogTitle className={"sr-only"}>nothing</DialogTitle>
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (isProjectError) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden p-0 border">
                    <DialogTitle className={"sr-only"}>nothing</DialogTitle>
                    <div className="flex justify-center items-center h-full">
                        <p className="text-red-500">Error loading project details.</p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!project) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden p-0 border">
                    <DialogTitle className={"sr-only"}>nothing</DialogTitle>
                    <div className="flex justify-center items-center h-full">
                        <p>Project not found.</p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden p-0 border">

                {/* Header with background image */}
                <div className="relative h-32 w-full">
                    <Image
                        src={project?.cover_image || "/images/placeholder-image.jpg"}
                        alt={project?.name || "Project"}
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Title overlay */}
                    <div className="absolute bottom-4 left-4">
                        <DialogTitle className={"font-bold text-sm text-white bg-black/40 px-2 py-1 rounded-lg"}>{project?.name || "Project Name"}</DialogTitle>
                        <span className="sr-only">{project?.name || "Project Name"}</span>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="max-h-[calc(90vh-128px)] overflow-y-auto">
                    <div className="p-4 space-y-4">
                        {/* Owner info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={project?.owner?.profile_image}
                                        alt={project?.owner?.name}
                                    />
                                    <AvatarFallback>
                                        {project?.owner?.name
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("") || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{project?.owner?.name || "Unknown Owner"}</p>
                                    <p className="text-xs">Owner</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge variant="secondary" className="mb-1">
                                    {project?.status || "Active"}
                                </Badge>
                                <p className="text-xs">
                                    {project?.createdAt
                                        ? new Date(project.createdAt).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })
                                        : "22 may 2023"}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {project?.description}
                        </p>

                        {/* Participant count */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span className="font-medium">{project?.totalParticipants} Participant</span>
                        </div>

                        {/* Producer and User columns */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Producer column */}
                            <div>
                                <h3 className="font-semibold text-sm mb-3">Producer</h3>
                                <div className="space-y-3">
                                    {isProducersLoading ? (
                                        <p>Loading producers...</p>
                                    ) : isProducersError ? (
                                        <p className="text-red-500">Error loading producers.</p>
                                    ) : producersData?.data?.result?.length > 0 ? (
                                        producersData.data.result.map((producer) => (
                                            <div key={producer._id} className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={producer.user?.profile_image || fallbackAvatar}
                                                        alt={producer.user?.name}
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(producer.user?.name) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-xs truncate">{producer.user?.name || "Unknown"}</p>
                                                    <p className="text-[10px] truncate">{producer.role || "Member"}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs">No producers found.</p>
                                    )}
                                </div>
                            </div>

                            {/* User column */}
                            <div>
                                <h3 className="font-semibold text-sm mb-3 text-right">User</h3>
                                <div className="space-y-3">
                                    {isConsumersLoading ? (
                                        <p>Loading users...</p>
                                    ) : isConsumersError ? (
                                        <p className="text-red-500">Error loading users.</p>
                                    ) : consumersData?.data?.result?.length > 0 ? (
                                        consumersData.data.result.map((consumer) => (
                                            <div key={consumer._id} className="flex items-center gap-2 justify-end">
                                                <div className="min-w-0 flex-1 text-right">
                                                    <p className="font-medium text-xs truncate">{consumer.user?.name || "Unknown"}</p>
                                                    <p className="text-[10px] truncate">{consumer.role || "Member"}</p>
                                                </div>
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={consumer.user?.profile_image || fallbackAvatar}
                                                        alt={consumer.user?.name}
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(consumer.user?.name) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-end">No users found.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* View all link */}
                        {producersData?.data?.result?.length > 5 || consumersData?.data?.result?.length > 5 && (
                            <div className="flex justify-end">
                                <button className="text-sm text-primary dark:text-white font-medium">View all</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed bottom section with join button */}
                <div className="border-t  p-4">
                    <Button
                        loading={isSendingRequest}
                        disabled={project?.joinControll === "Private" || isSendingRequest || project?.isOwner || project?.isJoined || project?.isJoinRequestSent}
                        onClick={() => handleSendJoinRequest(project?._id)}
                        className="w-full">
                        {project?.isOwner ? "Owner" : project?.isJoinRequestSent ? "Request Sent" : project?.isJoined ? "Joined" : "Join Project"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}