"use client";

import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useGetMyProfileQuery, useGetSkillsQuery } from "@/lib/features/api/authApi";
import { useGetAllRelativesQuery, useDeleteRelativeMutation } from "@/lib/features/api/relativesApi";
import { toast } from "sonner";
import AddRelativeModal from "@/components/profile/modal/AddRelativeModal";
import EditRelativeModal from "@/components/profile/modal/EditRelativeModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileBio from "@/components/profile/ProfileBio";
import SocialLinks from "@/components/profile/SocialLinks";
import FriendsSection from "@/components/profile/FriendsSection";
import RelativesSection from "@/components/profile/RelativesSection";
import { Card, CardContent } from "@/components/ui/card";
import ProfilePageSkeleton from "@/components/skeleton/ProfilePageSkeleton";

const ProfilePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRelative, setSelectedRelative] = useState(null);

    const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useGetMyProfileQuery();
    const { data: skillsData, isLoading: isSkillsLoading, isError: isSkillsError } = useGetSkillsQuery();
    const { data: relativesData, isLoading: isRelativesLoading, isError: isRelativesError } = useGetAllRelativesQuery();
    const [deleteRelative, { isLoading: isDeleting }] = useDeleteRelativeMutation();

    const user = profileData?.data;
    const allSkills = skillsData?.data?.result || [];
    const relatives = relativesData?.data?.result || [];

    const userSkills = user?.skills?.map(skillId => {
        const skill = allSkills.find(s => s._id === skillId);
        return skill ? skill.name : null;
    }).filter(Boolean) || [];

    const father = relatives.find(r => r.relation.toLowerCase() === 'father');
    const mother = relatives.find(r => r.relation.toLowerCase() === 'mother');

    const maternalRelatives = relatives.filter(r => r.familySide === 'Maternal' && r.relation.toLowerCase() !== 'mother' && r.relation.toLowerCase() !== 'father');
    const paternalRelatives = relatives.filter(r => r.familySide === 'Paternal' && r.relation.toLowerCase() !== 'father' && r.relation.toLowerCase() !== 'mother');

    const handleEdit = (relative) => {
        setSelectedRelative(relative);
        setIsEditModalOpen(true);
    };

    const handleDelete = (relative) => {
        setSelectedRelative(relative);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedRelative) return;
        try {
            await deleteRelative(selectedRelative._id).unwrap();
            toast.success("Relative deleted successfully");
            setIsDeleteModalOpen(false);
            setSelectedRelative(null);
        } catch (error) {
            toast.error(error.data?.message || "Failed to delete relative");
        }
    };

    // Fake Data (will be replaced by real data)
    const fakeFriends = [
        { name: "MR. Sarwar", role: "Artist", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "MR. Fahad", role: "Engineer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "Ahmad Musa", role: "Emam", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "MR. TA Emon", role: "Biker", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "MR. Mehehi", role: "Artist", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "MR. Dindinia", role: "Artist", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "MR. Nahid", role: "Scientist", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "Ahmad Mus", role: "Emam", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd975fe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
    ];

    if (isProfileLoading || isSkillsLoading || isRelativesLoading) {
        return <PageLayout><div className="min-h-minus-header"><ProfilePageSkeleton /></div></PageLayout>;
    }

    if (isProfileError || isSkillsError || isRelativesError) {
        return <PageLayout><div className="min-h-minus-header not-[]:text-red-500">Error loading profile.</div></PageLayout>;
    }

    if (!user) {
        return <PageLayout><div className="min-h-minus-header">No profile data found.</div></PageLayout>;
    }

    return (
        <div className="md:max-w-[1400px] mx-auto mb-5">
            <Card className="rounded-none overflow-hidden shadow-none "> {/* border-none dark:bg-gradient-to-tl dark:from-gray-700 dark:via-gray-900 dark:to-black bg-gradient-to-tl from-green-200 via-purple-200 to-yellow-200 */}
                <ProfileHeader user={user} userSkills={userSkills} fakeFriends={fakeFriends} mother={mother} father={father} />
                <CardContent className="p-6">
                    <ProfileBio user={user} />
                    <SocialLinks user={user} />
                    <FriendsSection fakeFriends={fakeFriends} />
                    <RelativesSection
                        maternalRelatives={maternalRelatives}
                        paternalRelatives={paternalRelatives}
                        isLoading={isRelativesLoading}
                        isError={isRelativesError}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        openAddRelativeModal={() => setIsModalOpen(true)}
                    />
                </CardContent>
            </Card>
            <AddRelativeModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
            <EditRelativeModal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} relative={selectedRelative} />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="Are you sure?"
                description="This action cannot be undone. This will permanently delete the relative."
                onConfirm={confirmDelete}
                loading={isDeleting}
                confirmText="Delete"
            />
        </div>
    );
};

export default ProfilePage;
