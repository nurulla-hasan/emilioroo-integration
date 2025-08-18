import { Skeleton } from "@/components/ui/skeleton";

const InstitutionHeaderSkeleton = () => {
    return (
        <>
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="py-4 flex justify-between items-start">
                <div>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <div className="flex items-center space-x-2 mt-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                </div>
            </div>
        </>
    );
};

export default InstitutionHeaderSkeleton;
