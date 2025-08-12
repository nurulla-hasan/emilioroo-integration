import React from 'react';
import { Skeleton } from '../ui/skeleton';

const SinglePlaylistSkeleton = () => {
    return (
        <div>
            {/* Banner Skeleton */}
            <Skeleton className="w-full h-48 rounded-lg mb-6" />

            {/* Header Info Skeleton */}
            <div className="mb-6">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2 mb-4" />
                <Skeleton className="h-4 w-1/4 mb-4" />

                {/* Creator Info Skeleton */}
                <div className="flex items-center gap-3 mb-6">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>

                {/* Buttons Skeleton */}
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-32 rounded-md" />
                    <Skeleton className="h-10 w-32 rounded-md" />
                </div>
            </div>

            {/* Audio List Skeleton */}
            <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center bg-card rounded-lg shadow-sm p-4">
                        <Skeleton className="w-24 h-24 rounded-md flex-shrink-0 mr-4" />
                        <div className="flex-1">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="w-20 h-10 rounded-md ml-4" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SinglePlaylistSkeleton;