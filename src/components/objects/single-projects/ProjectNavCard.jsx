"use client";

import { cn } from "@/lib/utils";
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useSendJoinRequestMutation } from "@/lib/features/api/projectApi";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const ProjectNavCard = ({ project, isActive }) => {
    const router = useRouter();
    const [sendJoinRequest, { isLoading: isSendingRequest }] = useSendJoinRequestMutation();

    const handleNavigate = () => {
        router.push(`/objects/${project._id}/workspace`);
    };

    const handleSendJoinRequest = async (e) => {
        e.stopPropagation();
        try {
            await sendJoinRequest(project._id).unwrap();
            toast.success("Join request sent successfully!");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to send join request.");
        }
    };

    return (
        <Card className={cn("w-full overflow-hidden bg-card flex flex-col cursor-pointer hover:bg-muted", isActive && "bg-primary/10 border border-primary/30")} onClick={handleNavigate}>
            <CardContent className="p-3 flex flex-col justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 bg-card border rounded-md flex-shrink-0">
                        <Image
                            src={project?.cover_image || "/placeholder.png"}
                            alt={project?.name || "Project cover"}
                            fill
                            sizes="100px"
                            className="object-cover rounded-md"
                            priority
                        />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-sm font-semibold text-primary dark:text-white truncate">
                            {project?.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                            {project?.description.slice(0, 30)}...
                        </p>
                    </div>
                    <Badge variant={"outline"} className={`text-[10px] ${project?.joinControll === "Public" ? "text-green-500" : "text-red-500"}`}>{project?.joinControll}</Badge>
                </div>
                <Button
                    loading={isSendingRequest}
                    variant="outline"
                    onClick={handleSendJoinRequest}
                    disabled={isSendingRequest || project.isJoined || project.isJoinRequestSent || project?.joinControll === "Private" || project?.isOwner}
                    className={`flex-shrink-0 ${project.isJoinRequestSent ? "bg-yellow-700" : project.isJoined ? "bg-green-700" : "bg-primary"} text-white`}
                >
                    {/* {project.isJoinRequestSent ? "Request Sent" : project.isJoined ? "Joined" : "Join Project"} */}
                    {project?.isOwner ? "Owner" : project?.isJoinRequestSent ? "Request Sent" : project?.isJoined ? "Joined" : "Join Project"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default ProjectNavCard;
