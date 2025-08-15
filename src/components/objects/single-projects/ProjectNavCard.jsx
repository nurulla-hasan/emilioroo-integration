"use client";

import { cn } from "@/lib/utils";
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useSendJoinRequestMutation } from "@/lib/features/api/projectApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
                </div>
                <Button
                    variant="outline"
                    onClick={handleSendJoinRequest}
                    disabled={isSendingRequest}
                    className="flex-shrink-0"
                >
                    {isSendingRequest ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending</> : "Request to join"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default ProjectNavCard;
