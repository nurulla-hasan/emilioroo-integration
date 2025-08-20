"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Edit } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { fallbackAvatar, getInitials } from "@/lib/utils";

const ProfileHeader = ({ user, userSkills, fakeFriends, mother, father }) => {
    return (
        <div className="relative w-full">
            <div className="relative w-full h-64">
                <div className="relative h-full w-full">
                    <Image src={"/images/cover.jpg"} alt="Cover Image" fill className="object-cover" />
                </div>
                <Button variant="secondary" size="icon" className="absolute top-4 right-4 rounded-full">
                    <Camera className="h-5 w-5" />
                </Button>
                {/* Mother Avatar */}
                {mother && (
                    <div className="absolute -bottom-10 left-4 flex flex-col items-center">
                        <Avatar className="w-16 h-16 border-2 border-white">
                            <AvatarImage src={mother.relative?.profile_image || fallbackAvatar} />
                            <AvatarFallback>{getInitials(mother.relative?.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold mt-1">Mother</span>
                    </div>
                )}
                {/* Father Avatar */}
                {father && (
                    <div className="absolute -bottom-10 right-4 flex flex-col items-center">
                        <Avatar className="w-16 h-16 border-2 border-white">
                            <AvatarImage src={father.relative?.profile_image || fallbackAvatar} />
                            <AvatarFallback>{getInitials(father.relative?.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold mt-1">Father</span>
                    </div>
                )}
            </div>
            <div className="relative p-6 pt-0">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                        <AvatarImage src={user.profile_image || null} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 rounded-full">
                        <Camera className="h-5 w-5" />
                    </Button>
                </div>

                <div className="text-center pt-20">
                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                        {user.name}
                        <Link href="/settings">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Edit />
                            </Button>
                        </Link>
                    </h2>
                    <div className="flex gap-2 mt-2 justify-center">
                        {userSkills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{fakeFriends.length} Followers</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
