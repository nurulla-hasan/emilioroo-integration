"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import JoinInstitutionModal from "@/components/institutions/modal/JoinInstitutionModal";

const InstitutionNavCard = ({ institution }) => {
    const router = useRouter();
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    const handleNavigate = () => {
        router.push(`/institutions/${institution._id}`);
    };

    const handleJoinClick = (e) => {
        e.stopPropagation(); // Prevent card's onClick from firing
        setIsJoinModalOpen(true);
    };

    return (
        <>
            <Card className="w-full overflow-hidden bg-card flex flex-col cursor-pointer" onClick={handleNavigate}>
                <CardContent className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 bg-card border rounded-md flex-shrink-0">
                            <Image
                                src={institution?.cover_image || "/placeholder.png"}
                                alt={institution?.name || "Institution cover"}
                                fill
                                sizes="48px"
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
                        className="flex-shrink-0"
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
