"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Title2 from "@/components/ui/Title2";
import { getInitials } from "@/lib/utils";

const FriendsSection = ({ fakeFriends }) => {
    return (
        <div className="mt-8">
            <div className="flex justify-between items-center">
                <Title2>Friends</Title2>
                <Button variant="link" size="sm">view more</Button>
            </div>
            <div className="mt-4 flex space-x-6 overflow-x-auto pb-2">
                {fakeFriends.slice(0, 13).map((friend, index) => (
                    <div key={index} className="flex flex-col items-center flex-shrink-0">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={friend.avatar} />
                            <AvatarFallback>{getInitials(friend.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium mt-2 whitespace-nowrap">{friend.name}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{friend.role}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendsSection;
