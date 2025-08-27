import { Skeleton } from "@/components/ui/skeleton";

const MessagePanelSkeleton = () => {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center p-4 border-b">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-4">
                    <Skeleton className="h-5 w-40" />
                </div>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                <div className="flex items-end">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="ml-2 h-10 w-48 rounded-lg" />
                </div>
                <div className="flex items-end justify-end">
                    <Skeleton className="mr-2 h-10 w-64 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="flex items-end">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="ml-2 h-16 w-60 rounded-lg" />
                </div>
                <div className="flex items-end justify-end">
                    <Skeleton className="mr-2 h-10 w-32 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                 <div className="flex items-end">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="ml-2 h-10 w-48 rounded-lg" />
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
                <div className="flex items-center">
                    <Skeleton className="h-10 flex-grow rounded-lg" />
                    <Skeleton className="ml-4 h-10 w-20 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default MessagePanelSkeleton;