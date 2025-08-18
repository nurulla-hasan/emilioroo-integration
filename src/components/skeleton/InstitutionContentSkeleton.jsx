import { Skeleton } from "@/components/ui/skeleton";

const InstitutionContentSkeleton = () => {
    return (
        <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="col-span-1">
                <div className="border rounded-lg p-3">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
            <div className="col-span-2 border rounded-lg p-3">
                <Skeleton className="h-6 w-48 mb-2" />
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
            <div className="col-span-1">
                <div className="border rounded-lg p-3">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionContentSkeleton;
