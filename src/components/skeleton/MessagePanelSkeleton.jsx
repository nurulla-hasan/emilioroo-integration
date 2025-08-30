import { Skeleton } from "@/components/ui/skeleton";

const MessageBubbleSkeleton = ({ isMyMessage = false }) => {
  return (
    <div className={`flex items-start gap-3 ${isMyMessage ? "flex-row-reverse" : ""}`}>
      {!isMyMessage && (
        <Skeleton className="h-8 w-8 rounded-full" />
      )}
      <div className="flex flex-col gap-2 max-w-sm w-full">
        {!isMyMessage && (
          <Skeleton className="h-3 w-20" />
        )}
        <div className={`rounded-lg px-3 py-2 ${isMyMessage ? "bg-primary/20" : "bg-muted"}`}>
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
};

const MessagePanelSkeleton = () => {
  return (
    <div className="bg-muted/50 rounded-lg p-4 overflow-y-auto flex flex-col gap-4">
      {/* Header */}
      <div className="h-12 mb-4 flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-5 w-40 rounded-lg" />
      </div>

      {/* Chat bubbles */}
      <MessageBubbleSkeleton />
      <MessageBubbleSkeleton />
      <MessageBubbleSkeleton isMyMessage />
      <MessageBubbleSkeleton />
      <MessageBubbleSkeleton isMyMessage />
      <MessageBubbleSkeleton />
    </div>
  );
};

export default MessagePanelSkeleton;
