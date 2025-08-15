"use client";

import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const ProjectWorkspaceHeader = ({ project }) => {
    return (
        <div className="mb-8">
            <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                <Image
                    src={project.cover_image || "/images/hero.png"}
                    alt={project.name}
                    fill
                    sizes="100%"
                    priority
                    className="object-cover"
                />
            </div>
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-lg md:text-2xl font-bold">{project.name}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={project.owner.avatar} />
                            <AvatarFallback>{project.owner.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-semibold">{project.owner.name}</p>
                            <p className="text-xs text-muted-foreground">Owner</p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className='flex gap-2'>
                        <Badge variant="secondary">{project.status}</Badge>
                        <Badge variant="secondary">{project.joinControll}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Created: {formatDate(project.createdAt)}</p>
                </div>
            </div>
                <p className="text-muted-foreground mt-2">{project.description}</p>
        </div>
    );
};

export default ProjectWorkspaceHeader;
