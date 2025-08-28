import { Skeleton } from "@/components/ui/skeleton";

const ProjectDetailsPageSkeleton = () => {
    return (
        <div>
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center space-x-2 mb-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
            </div>

            {/* ProjectHeader Skeleton */}
            <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-4 w-full">
                        <Skeleton className="h-40 w-full rounded-lg" />
                        <div className="flex flex-col md:flex-row gap-2 justify-between w-[100%]">
                            <div>
                                <Skeleton className="h-7 w-48 mb-2" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                            <Skeleton className="h-10 w-20" />
                        </div>
                    </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
            </div>


            <div className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* MembersList Skeleton */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-9 w-24" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-md border">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div>
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16 mt-1" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* MembersList Skeleton */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-9 w-24" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-md border">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div>
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16 mt-1" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* JoinRequests Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <div className="border rounded-lg p-4 space-y-3">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-md border">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div>
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48 mt-1" />
                                    </div>
                                </div>
                                <div className="md:flex gap-2 hidden">
                                    <Skeleton className="h-9 w-20" />
                                    <Skeleton className="h-9 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPageSkeleton;