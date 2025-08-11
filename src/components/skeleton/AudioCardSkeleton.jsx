import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const AudioCardSkeleton = () => {
  return (
    <Card className="w-full overflow-hidden bg-card flex flex-col group">
      <CardContent className="p-0 relative">
        <div className="relative h-48 w-full">
          <Skeleton className="w-full h-full" />
        </div>
      </CardContent>
      <CardFooter className="p-5 flex flex-col items-start flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex flex-wrap gap-2 mt-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="w-full border-t border-gray-200 my-3"></div>
        <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AudioCardSkeleton;
