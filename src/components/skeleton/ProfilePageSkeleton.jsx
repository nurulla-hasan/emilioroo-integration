import { Skeleton } from "@/components/ui/skeleton";
import Title2 from "@/components/ui/Title2";

const ProfilePageSkeleton = () => {
    return (
        <div>
            {/* ProfileHeaderSkeleton */}
            <div className="relative w-full">
                <div className="relative w-full h-64">
                    <Skeleton className="h-full w-full" />
                    <Skeleton variant="secondary" size="icon" className="absolute top-4 right-4 rounded-full h-10 w-10" />
                    {/* Mother Avatar Skeleton */}
                    <div className="absolute -bottom-10 left-4 flex flex-col items-center">
                        <Skeleton className="w-16 h-16 rounded-full border-2 border-white" />
                        <Skeleton className="h-4 w-12 mt-1" />
                    </div>
                    {/* Father Avatar Skeleton */}
                    <div className="absolute -bottom-10 right-4 flex flex-col items-center">
                        <Skeleton className="w-16 h-16 rounded-full border-2 border-white" />
                        <Skeleton className="h-4 w-12 mt-1" />
                    </div>
                </div>
                <div className="relative p-6 pt-0">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                        <Skeleton className="w-32 h-32 rounded-full border-4 border-white shadow-lg" />
                        <Skeleton variant="secondary" size="icon" className="absolute bottom-0 right-0 rounded-full h-10 w-10" />
                    </div>

                    <div className="text-center pt-20">
                        <Skeleton className="h-8 w-40 mx-auto" />
                        <div className="flex gap-2 mt-2 justify-center">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-4 w-24 mt-2 mx-auto" />
                    </div>
                </div>
            </div>

            {/* ProfileBioSkeleton */}
            <div className="relative group mt-8 max-w-4xl mx-auto">
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>

            {/* SocialLinksSkeleton */}
            <div className="mt-8">
                <div className="flex justify-between items-center">
                    <Title2 className="text-lg font-semibold">Social Links</Title2>
                </div>
                <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
            </div>

            {/* FriendsSectionSkeleton */}
            <div className="mt-8">
                <div className="flex justify-between items-center">
                    <Title2>Friends</Title2>
                    <Skeleton className="h-8 w-20" />
                </div>
                <div className="mt-4 flex space-x-6 overflow-x-auto pb-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex flex-col items-center flex-shrink-0">
                            <Skeleton className="w-16 h-16 rounded-full" />
                            <Skeleton className="h-4 w-16 mt-2" />
                            <Skeleton className="h-3 w-12 mt-1" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfilePageSkeleton;