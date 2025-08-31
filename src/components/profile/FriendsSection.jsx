"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Title2 from "@/components/ui/Title2";
import { fallbackAvatar2, getInitials } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

const FriendsSection = ({ friends, isLoading, isError, showViewMore = true }) => {

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center">
                <Title2>Friends</Title2>
                {showViewMore && (
                    <Link href="/friends">
                        <Button variant="link" size="sm">view more</Button>
                    </Link>
                )}
            </div>
            <div className="mt-4 flex space-x-6 overflow-x-auto pb-2">
                {isLoading &&
                    [...Array(5)].map((_, index) => (
                        <div key={index} className="flex flex-col items-center flex-shrink-0">
                            <Skeleton className="w-16 h-16 rounded-full" />
                            <Skeleton className="h-4 w-20 mt-2" />
                            <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                    ))}
                {!isLoading && !isError && friends.length > 0 &&
                    friends.slice(0, 13).map((friend, index) => (
                        <div key={index} className="flex flex-col items-center flex-shrink-0">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={friend.friendInfo?.profile_image || fallbackAvatar2} />
                                <AvatarFallback>{getInitials(friend.friendInfo?.name)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium mt-2 whitespace-nowrap">{friend.friendInfo?.name}</span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{friend.friendInfo?.email}</span>
                        </div>
                    ))}
                {!isLoading && !isError && friends.length === 0 && (
                    <p className="text-muted-foreground">No friends to show.</p>
                )}
                {isError && <p className="text-red-500">Failed to load friends.</p>}
            </div>
        </div>
    );
};

export default FriendsSection;
