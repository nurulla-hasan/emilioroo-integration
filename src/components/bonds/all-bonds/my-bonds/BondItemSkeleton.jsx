"use client";

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const BondItemSkeleton = ({ count = 3 }) => {
    return (
        <div className="space-y-2">
            {[...Array(count)].map((_, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-4 bg-muted rounded-md mb-2">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BondItemSkeleton;
