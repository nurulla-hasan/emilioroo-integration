"use client";

import { Skeleton } from "../ui/skeleton";

const PostFeedSkeleton = ({count = 5}) => {
    return (
        <div className="mt-4 border rounded-lg p-3">
            <div className="space-y-4">
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index} className="bg-card p-4 rounded-lg border">
                        <div className="flex items-start space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="w-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16 mt-1" />
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-full mt-2" />
                                <Skeleton className="h-4 w-full mt-1" />
                                <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-8 w-20" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostFeedSkeleton;
