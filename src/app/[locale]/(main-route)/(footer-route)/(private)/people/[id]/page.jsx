"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { useGetSingleUserQuery } from "@/lib/features/api/projectApi";
import { useGetSkillsQuery } from "@/lib/features/api/authApi";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileBio from "@/components/profile/ProfileBio";
import SocialLinks from "@/components/profile/SocialLinks";
import FriendsSection from "@/components/profile/FriendsSection";
import RelativesSection from "@/components/profile/RelativesSection";
import { Card, CardContent } from "@/components/ui/card";
import ProfilePageSkeleton from "@/components/skeleton/ProfilePageSkeleton";

const UserProfilePage = () => {
    const { id } = useParams();

    const { data: userData, isLoading: isUserLoading, isError: isUserError } = useGetSingleUserQuery(id);
    const { data: skillsData, isLoading: isSkillsLoading, isError: isSkillsError } = useGetSkillsQuery();

    const user = userData?.data;
    
    const allSkills = useMemo(() => skillsData?.data?.result || [], [skillsData]);

    const userSkills = useMemo(() => {
        if (!user?.skills || !allSkills.length) return [];
        return user.skills.map(skillId => {
            const skill = allSkills.find(s => s._id === skillId);
            return skill ? skill.name : null;
        }).filter(Boolean);
    }, [user?.skills, allSkills]);

    if (isUserLoading || isSkillsLoading) {
        return <PageLayout><div className="min-h-minus-header"><ProfilePageSkeleton /></div></PageLayout>;
    }

    if (isUserError || isSkillsError) {
        return <PageLayout><div className="min-h-minus-header text-red-500">Error loading profile.</div></PageLayout>;
    }

    if (!user) {
        return <PageLayout><div className="min-h-minus-header">No profile data found.</div></PageLayout>;
    }

    return (
        <div className="bg-gradient-to-r from-green-200 to-indigo-300  dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 pb-5">
            <div>
                <Card className="rounded-none overflow-hidden shadow-none bg-transparent border-none">
                    {/* Passing null/empty arrays for data not available for other users */}
                    <ProfileHeader user={user} userSkills={userSkills} mother={null} father={null} friends={[]} />
                    <CardContent className="p-4 xl:p-2 xl:w-[1400px] md:mx-auto">
                        <ProfileBio user={user} />
                        <SocialLinks user={user} />
                        
                        <FriendsSection friends={[]} isLoading={false} isError={false} showViewMore={false} />
                        <RelativesSection
                            maternalRelatives={[]}
                            paternalRelatives={[]}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserProfilePage;
