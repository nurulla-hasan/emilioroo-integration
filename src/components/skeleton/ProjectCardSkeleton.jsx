"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectCardSkeleton = ({ count = 1 }) => {
    return (
        <>
            {[...Array(count)].map((_, index) => (
                <Card key={index} className="overflow-hidden rounded-lg flex flex-col">
                    <Skeleton className="w-full h-48 rounded-t-lg" />
                    <CardHeader className="p-4 pb-2">
                        <Skeleton className="h-6 w-3/4" />
                        <div className="flex flex-wrap gap-1 mb-2">
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-6 w-1/5" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow mb-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6 mt-2" />
                    </CardContent>
                    <CardContent className="px-4 py-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div>
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-12 mt-1" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                        <Skeleton className="h-7 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </>
    );
};

export default ProjectCardSkeleton;
