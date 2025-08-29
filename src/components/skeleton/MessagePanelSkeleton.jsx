import { Skeleton } from "@/components/ui/skeleton";

const MessageSkeleton = () => {
    return (
        <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
};

const MessagePanelSkeleton = () => {
    return (
        <div className="bg-muted/50 rounded-lg p-4 h-96 overflow-y-auto flex flex-col gap-4">
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
        </div>
    );
};

export default MessagePanelSkeleton;
