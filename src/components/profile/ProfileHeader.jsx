"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Flag } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";
import { fallbackAvatar, getInitials } from "@/lib/utils";
import { ReportUserModal } from "./ReportUserModal";
import { useTranslations } from "next-intl";

const ProfileHeader = ({ user, userSkills, mother, father, friends, isEditable = false, onEditBio }) => {
    const t = useTranslations('ProfilePage');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <>
            <div className="relative w-full">
                <div className="relative w-full h-60">
                    <div className="relative h-full w-full">
                        <Image src={user.cover_image || "/images/placeholder-image.jpg"} alt="Cover Image" fill className="object-cover" priority />
                    </div>
                    {/* Mother Avatar */}
                    <div className="max-w-[1400px] mx-auto relative">
                        {mother && (
                            <div className="absolute top-4 left-2 flex flex-col items-center">
                                <Avatar className="md:w-16 md:h-16 w-12 h-12 border-2 border-white">
                                    <AvatarImage src={mother.relative?.profile_image || fallbackAvatar("FEMALE")} />
                                    <AvatarFallback>{getInitials(mother.relative?.name)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-semibold mt-1">{mother.relative?.name}</span>
                                <span className="text-xs text-muted-foreground mt-1">{t('mother')}</span>
                            </div>
                        )}
                        {/* Father Avatar */}
                        {father && (
                            <div className="absolute top-4 right-2 flex flex-col items-center">
                                <Avatar className="md:w-16 md:h-16 w-12 h-12 border-2 border-white">
                                    <AvatarImage src={father.relative?.profile_image || fallbackAvatar("MALE")} />
                                    <AvatarFallback>{getInitials(father.relative?.name)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-semibold mt-1">{father.relative?.name}</span>
                                <span className="text-xs text-muted-foreground mt-1">{t('father')}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="relative p-6 pt-0">
                    <div className="absolute md:-top-16 -top-12 left-1/2 -translate-x-1/2">
                        <Avatar className="md:w-32 md:h-32 w-20 h-20 border-4 border-white shadow-lg">
                            <AvatarImage src={user.profile_image || fallbackAvatar(user.gender)} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="text-center pt-20">
                        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                            {user.name}
                            {isEditable ? (
                                <Link href="/settings">
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Edit />
                                    </Button>
                                </Link>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsReportModalOpen(true)}>
                                            <Flag />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('reportUser')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </h2>
                        <div className="flex gap-2 mt-2 justify-center">
                            {userSkills.map((skill, index) => (
                                <Badge key={index} variant="outline">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{friends.length} {t('friends')}</p>
                        <div className="relative group max-w-4xl mx-auto mt-4">
                            <p className="text-sm text-muted-foreground text-center">{user.bio}</p>
                            {isEditable && (
                                <Button variant="ghost" size="icon" className="absolute -bottom-8 transform -translate-x-1/2 left-1/2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={onEditBio}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ReportUserModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} reportTo={user._id} />
        </>
    );
};

export default ProfileHeader;