import { Skeleton } from "@/components/ui/skeleton";

const ConversationAudioCardSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center bg-card border rounded-lg p-4">
      <div className="relative w-full h-48 sm:w-24 sm:h-24 rounded-md overflow-hidden flex-shrink-0 sm:mr-4 mb-4 sm:mb-0">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end w-full">
        <div className="flex-1 w-full">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-3" />
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="hidden md:flex items-center gap-1">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="hidden lg:flex items-center gap-1">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="hidden lg:block h-4 w-12" />
        </div>
      </div>
    </div>
  );
};

export default ConversationAudioCardSkeleton;
