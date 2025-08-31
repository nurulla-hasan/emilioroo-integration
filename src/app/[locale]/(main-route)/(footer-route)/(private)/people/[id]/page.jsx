"use client";

import { useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import PeopleCardButton from "@/components/people/PeopleCardButton";
import { SendMessageModal } from "@/components/friends/SendMessageModal";
import { useSocket } from "@/context/soket-context/SocketContext";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { baseApi } from "@/lib/features/api/baseApi";
import { Mail } from "lucide-react";

const UserProfilePage = () => {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { sendMessage } = useSocket();
    const dispatch = useDispatch();

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

    const relatives = user?.relatives || [];

    const father = relatives.find(r => r.relation.toLowerCase() === 'father');
    const mother = relatives.find(r => r.relation.toLowerCase() === 'mother');

    const maternalRelatives = relatives.filter(r => r.familySide === 'Maternal' && r.relation.toLowerCase() !== 'mother' && r.relation.toLowerCase() !== 'father');
    const paternalRelatives = relatives.filter(r => r.familySide === 'Paternal' && r.relation.toLowerCase() !== 'father' && r.relation.toLowerCase() !== 'mother');

    const handleSendMessage = (messageText) => {
        if (!user?._id) {
            console.error("User ID is missing");
            toast.error("Could not send message, user ID is missing.");
            return;
        }

        const payload = {
            text: messageText,
            receiver: user._id,
            imageUrl: [],
            videoUrl: []
        };

        sendMessage(payload);
        setIsModalOpen(false);
        toast.success(`Message sent to ${user.name}`);
        dispatch(baseApi.util.invalidateTags(['CONVERSATIONS']));
    };

    if (isUserLoading || isSkillsLoading) {
        return <div className="min-h-minus-header"><ProfilePageSkeleton /></div>;
    }

    if (isUserError || isSkillsError) {
        return <PageLayout><div className="min-h-minus-header text-red-500">Error loading profile.</div></PageLayout>;
    }

    if (!user) {
        return <PageLayout><div className="min-h-minus-header">No profile data found.</div></PageLayout>;
    }

    return (
        <>
            <div className="bg-gradient-to-r from-green-200 to-indigo-300  dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 pb-5">
                <div>
                    <Card className="rounded-none overflow-hidden shadow-none bg-transparent border-none">
                        <ProfileHeader user={user} userSkills={userSkills} mother={mother} father={father} friends={[]}>
                            <div className="flex justify-center gap-4 mt-4">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsModalOpen(true)}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Message
                                </Button>
                                <div className="w-fit">
                                    <PeopleCardButton user={user} />
                                </div>
                            </div>
                        </ProfileHeader>
                        <CardContent className="p-4 xl:p-2 xl:w-[1400px] md:mx-auto">
                            <ProfileBio user={user} />
                            <SocialLinks user={user} />
                            
                            <FriendsSection friends={[]} isLoading={false} isError={false} showViewMore={false} />
                            <RelativesSection
                                maternalRelatives={maternalRelatives}
                                paternalRelatives={paternalRelatives}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
            <SendMessageModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                receiverName={user?.name}
                onSend={handleSendMessage}
            />
        </>
    );
};

export default UserProfilePage;
