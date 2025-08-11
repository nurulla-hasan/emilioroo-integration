import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const ConversationAudioCardSkeleton = () => {
  return (
    <div className="flex items-center bg-card border rounded-lg p-4">
      <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 mr-4">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex-1">
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-full mb-2" />
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Badge variant="outline"><Skeleton className="h-4 w-12" /></Badge>
          <Badge variant="outline"><Skeleton className="h-4 w-16" /></Badge>
        </div>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex items-center gap-1">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
};

export default ConversationAudioCardSkeleton;
