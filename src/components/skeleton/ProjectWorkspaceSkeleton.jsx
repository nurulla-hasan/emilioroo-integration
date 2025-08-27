import { Skeleton } from "@/components/ui/skeleton";

const ProjectWorkspaceSkeleton = () => {
  return (
    <div className="space-y-8 p-4">
      {/* Header/Banner Skeleton */}
      <Skeleton className="h-48 w-full rounded-lg" />

      {/* Connection Starter Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 rounded-md" /> {/* Title */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" /> {/* Name */}
            <Skeleton className="h-3 w-24 rounded-md" /> {/* Owner */}
          </div>
        </div>
        <Skeleton className="h-4 w-full rounded-md" /> {/* Description line 1 */}
        <Skeleton className="h-4 w-5/6 rounded-md" /> {/* Description line 2 */}
      </div>

      {/* Grid Sections Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Producers List Skeleton */}
        <div className="lg:col-span-3">
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>

        {/* Files Section Skeleton */}
        <div className="lg:col-span-6">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        {/* Users List Skeleton */}
        <div className="lg:col-span-3">
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>

      {/* Project Discussion Skeleton */}
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
};

export default ProjectWorkspaceSkeleton;
