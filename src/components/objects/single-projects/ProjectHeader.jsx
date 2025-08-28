"use client"

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";

const ProjectHeader = ({ project, onEditProject }) => {
    return (
        <div>
            {/* Header Image */}
            <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6 border">
                <Image
                    src={project.cover_image || "/images/placeholder-image.jpg"}
                    alt={project.name}
                    fill={true}
                    priority
                    className="rounded-lg object-cover"
                />
            </div>

            {/* Project Info Header */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 border p-4 rounded-lg">
                <div className="w-full">
                    <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                    <div className="flex items-center space-x-2 mb-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={project.owner?.profile_image} />
                            <AvatarFallback>{project.owner?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <p className=" font-medium">{project.owner?.name || "Unknown"}</p>
                        <span className="text-xs">(Owner)</span>
                    </div>
                    <p className=" mb-4">{project.description}</p>
                    <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{project.totalParticipate || 0} Participant</span>
                    </div>
                </div>

                <div className="w-full flex flex-col items-end space-y-2">
                    <div className="flex flex-col-reverse md:flex-row md:items-center gap-2">
                        <Link href={`/objects/${project._id}/workspace`} className="flex-1">
                            <Button variant="outline" className="w-full">Open Workspace</Button>
                        </Link>
                        {
                            project.isOwner &&
                            <div className="text-end">
                                <Button className="w-fit" size="sm" onClick={() => onEditProject(project)}>
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                            </div>
                        }
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Badge variant="secondary">{project.status}</Badge>
                        <Badge variant="outline">{project.joinControll}</Badge>
                    </div>
                    <p className=" text-sm mt-2">{new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectHeader;
