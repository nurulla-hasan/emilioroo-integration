"use client";

import { cn } from "@/lib/utils";
import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import JoinInstitutionModal from "@/components/institutions/modal/JoinInstitutionModal";

const InstitutionNavCard = ({ institution, isActive }) => {
    const router = useRouter();
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    const handleNavigate = () => {
        router.push(`/institutions/${institution._id}`);
    };

    const handleJoinClick = (e) => {
        e.stopPropagation();
        setIsJoinModalOpen(true);
    };

    return (
        <>
            <Card className={cn("w-full overflow-hidden bg-card flex flex-col cursor-pointer hover:bg-muted", isActive && "bg-primary/10 border border-primary/30")} onClick={handleNavigate}>
                <CardContent className="p-3 flex flex-col items-start gap-3">
                    <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 bg-card border rounded-md flex-shrink-0">
                            <Image
                                src={institution?.cover_image || "/placeholder.png"}
                                alt={institution?.name || "Institution cover"}
                                fill
                                sizes="100px"
                                className="object-cover rounded-md"
                                priority
                            />
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-sm font-semibold text-primary dark:text-white truncate">
                                {institution?.name}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                                {institution?.description.slice(0, 30)}...
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleJoinClick}
                        className="flex-shrink-0 w-full"
                    >
                        Join
                    </Button>
                </CardContent>
            </Card>
            <JoinInstitutionModal
                isOpen={isJoinModalOpen}
                onOpenChange={setIsJoinModalOpen}
                institutionId={institution._id}
            />
        </>
    );
};

export default InstitutionNavCard;
