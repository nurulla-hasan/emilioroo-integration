"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

const InstitutionNavCard = ({ institution }) => {
    const router = useRouter();

    const handleNavigate = () => {
        router.push(`/institutions/${institution._id}`);
    };

    return (
        <Card className="w-full overflow-hidden bg-card flex flex-col cursor-pointer" onClick={handleNavigate}>
            <CardContent className="p-2 flex items-center gap-2">
                <div className="relative h-12 w-12 bg-card border rounded-md">
                    <Image
                        src={institution?.cover_image || "/placeholder.png"}
                        alt={institution?.name || "Institution cover"}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover rounded-md"
                        priority
                    />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-primary dark:text-white">
                        {institution?.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {institution?.description.slice(0, 30)}...
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default InstitutionNavCard;
