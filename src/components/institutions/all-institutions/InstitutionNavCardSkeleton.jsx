"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const InstitutionNavCardSkeleton = () => {
    return (
        <Card className="w-full overflow-hidden bg-card flex flex-col">
            <CardContent className="p-2 flex items-center gap-2">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className='w-full'>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
            </CardContent>
        </Card>
    );
};

export default InstitutionNavCardSkeleton;
