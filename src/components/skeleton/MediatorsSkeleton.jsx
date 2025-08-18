import { Skeleton } from "@/components/ui/skeleton";

const MediatorsSkeleton = () => {
    return (
        <div className="bg-card p-4 rounded-lg border">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex justify-around">
                <div className="flex flex-col items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-24 mt-2" />
                    <Skeleton className="h-3 w-16 mt-1" />
                </div>
                <div className="flex flex-col items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-24 mt-2" />
                    <Skeleton className="h-3 w-16 mt-1" />
                </div>
                <div className="flex flex-col items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-24 mt-2" />
                    <Skeleton className="h-3 w-16 mt-1" />
                </div>
            </div>
        </div>
    );
};

export default MediatorsSkeleton;
