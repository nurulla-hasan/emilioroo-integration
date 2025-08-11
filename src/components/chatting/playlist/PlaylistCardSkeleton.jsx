import { Skeleton } from "@/components/ui/skeleton";

const PlaylistCardSkeleton = () => {
  return (
    <div className="rounded-lg shadow-md overflow-hidden border">
      <div className="relative w-full aspect-video">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Skeleton className="w-4 h-4 mr-1 rounded-full" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex justify-between gap-2">
          <Skeleton className="h-10 w-1/2 rounded-md" />
          <Skeleton className="h-10 w-1/2 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default PlaylistCardSkeleton;
