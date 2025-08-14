"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const TrendingTopicCardSkeleton = ({ count = 1 }) => {
    return (
        <>
            {[...Array(count)].map((_, index) => (
                <div key={index} className="group w-full mx-auto overflow-hidden rounded-2xl border bg-card shadow-sm">
                    {/* Media Skeleton */}
                    <div className="relative w-full aspect-video">
                        <Skeleton className="w-full h-full" /> 

                        {/* Top badges Skeleton */}
                        <div className="absolute top-2 left-2 flex items-center gap-2">
                            <Badge className="bg-gray-700 text-primary"><Skeleton className="h-5 w-12" /></Badge>
                        </div>

                        {/* Bottom right: time ago pill Skeleton */}
                        <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] text-white bg-gray-800 backdrop-blur-sm">
                            <Clock className="h-3.5 w-3.5" />
                            <Skeleton className="h-3.5 w-16" /> 
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="p-5 flex flex-col gap-3">
                        <Skeleton className="h-6 w-3/4 text-xl font-semibold leading-tight" />
                        <Skeleton className="h-10 w-full mt-1 rounded-md" />
                    </div>
                </div>
            ))}
        </>
    );
};

export default TrendingTopicCardSkeleton;
