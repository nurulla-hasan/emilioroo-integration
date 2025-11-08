"use client";

import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useGetMyProfileQuery, useGetSkillsQuery } from "@/lib/features/api/authApi";
import { useGetAllRelativesQuery, useDeleteRelativeMutation, useGetRecommendedUserQuery } from "@/lib/features/api/relativesApi";
import { useGetMyFriendsQuery } from "@/lib/features/api/friendsApi";
import { toast } from "sonner";
import AddRelativeModal from "@/components/profile/modal/AddRelativeModal";
import EditRelativeModal from "@/components/profile/modal/EditRelativeModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SocialLinks from "@/components/profile/SocialLinks";
import FriendsSection from "@/components/profile/FriendsSection";
import { Card, CardContent } from "@/components/ui/card";
import ProfilePageSkeleton from "@/components/skeleton/ProfilePageSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Title2 from "@/components/ui/Title2";
import { getInitials, fallbackAvatar2 } from "@/lib/utils";
import { Link as LinkIcon, MessageSquare, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import EditBioModal from "@/components/profile/modal/EditBioModal";

const RelativeColumn = ({ relatives, title, handleEdit, handleDelete, isEditable }) => {
    const t = useTranslations('ProfilePage');
    return (
        <div>
            {
                relatives.length > 0 ? (
                    <>
                        <h4 className="text-md font-semibold mb-4">{title}</h4>
                        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                            {relatives.map((relative, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={relative.relative?.profile_image || fallbackAvatar2} />
                                            <AvatarFallback>{getInitials(relative.relative?.name || relative.relation)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{relative.relative?.name || relative.relation}</p>
                                            <p className="text-xs text-muted-foreground">{relative.relation}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            <MessageSquare /> <span className="hidden md:inline">{t('chatNow')}</span>
                                        </Button>
                                        {isEditable && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(relative)}>
                                                        {t('edit')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(relative)} className="text-red-600">
                                                        {t('delete')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        </>
                ) : (
                    <p className="text-center mt-8">No relatives found.</p>
                )
            }
        </div>
    );
};


const RecommendedUsersSection = ({ recommendedUsers }) => {
    const t = useTranslations('ProfilePage');
    const translate = (key, fallback) => {
        try {
            return t(key);
        } catch {
            return fallback;
        }
    };

    const heading = translate('recommendedUsers', 'Recommended Users');
    const emptyMessage = translate('noRecommendedUsers', 'No recommended users available yet.');

    return (
        <div className="mt-10">
            <Title2>{heading}</Title2>
            {recommendedUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground mt-4 text-center">{emptyMessage}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                    {recommendedUsers.map((user) => (
                        <div key={user._id} className="p-4 bg-background dark:bg-muted/40 border border-border rounded-lg shadow-sm flex flex-col gap-3">
                            <div>
                                <p className="font-semibold text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground break-all">{user.email}</p>
                            </div>
                            {user.phone && <p className="text-xs text-muted-foreground">{user.phone}</p>}
                            {user.skill?.name && (
                                <Badge variant="secondary" className="w-fit">
                                    {user.skill.name}
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const ProfilePage = () => {
    const t = useTranslations('ProfilePage');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRelative, setSelectedRelative] = useState(null);
    const [isEditBioModalOpen, setIsEditBioModalOpen] = useState(false);

    const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useGetMyProfileQuery();
    const { data: skillsData, isLoading: isSkillsLoading, isError: isSkillsError } = useGetSkillsQuery();
    const { data: relativesData, isLoading: isRelativesLoading, isError: isRelativesError } = useGetAllRelativesQuery();
    const { data: recommendedData, isLoading: isRecommendedLoading, isError: isRecommendedError } = useGetRecommendedUserQuery();
    const { data: friendsData, isLoading: isFriendsLoading, isError: isFriendsError } = useGetMyFriendsQuery();
    const [deleteRelative, { isLoading: isDeleting }] = useDeleteRelativeMutation();

    const user = profileData?.data;
    const allSkills = skillsData?.data?.result || [];
    const relatives = relativesData?.data?.result || [];
    const recommendedUsers = recommendedData?.data?.result || [];
    const friends = friendsData?.data?.result || [];

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
            toast.success(t("relativeDeletedSuccess"));
            setIsDeleteModalOpen(false);
            setSelectedRelative(null);
        } catch (error) {
            toast.error(error.data?.message || t("failedToDeleteRelative"));
        }
    };

    if (isProfileLoading || isSkillsLoading || isRelativesLoading || isFriendsLoading || isRecommendedLoading) {
        return <div className="min-h-minus-header"><ProfilePageSkeleton /></div>;
    }

    if (isProfileError || isSkillsError || isRelativesError || isFriendsError || isRecommendedError) {
        return <PageLayout><div className="min-h-minus-header not-[]:text-red-500">{t('errorLoadingProfile')}</div></PageLayout>;
    }

    if (!user) {
        return <PageLayout><div className="min-h-minus-header">{t('noProfileData')}</div></PageLayout>;
    }

    return (
        <div className="bg-gradient-to-r from-green-200 to-indigo-300  dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 pb-5">
            <div>
                <Card className="rounded-none overflow-hidden shadow-none bg-transparent border-none">
                    <ProfileHeader user={user} userSkills={userSkills} mother={mother} father={father} friends={friends} isEditable={true} onEditBio={() => setIsEditBioModalOpen(true)} />
                    <CardContent className="p-4 xl:p-2 xl:w-[1400px] md:mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                            <div className="md:col-span-1">
                                <Title2>{t('relativesAndRelationships')}</Title2>
                                <div className="mt-4">
                                    <RelativeColumn relatives={paternalRelatives} title={t("fathersSide")} handleEdit={handleEdit} handleDelete={handleDelete} isEditable={true} />
                                </div>
                            </div>
                            <div className="md:col-span-1">
                                {/* This column is empty as the bio is in the header */}
                            </div>
                            <div className="md:col-span-1">
                                <div className="flex justify-end mb-4">
                                    <Button size="sm" onClick={() => setIsModalOpen(true)}>
                                        <LinkIcon className="mr-2" /> {t('addNewRelative')}
                                    </Button>
                                </div>
                                <RelativeColumn relatives={maternalRelatives} title={t("mothersSide")} handleEdit={handleEdit} handleDelete={handleDelete} isEditable={true} />
                            </div>
                        </div>
                        <SocialLinks user={user} />
                        <RecommendedUsersSection recommendedUsers={recommendedUsers} />
                        <FriendsSection friends={friends} />
                    </CardContent>
                </Card>
                <AddRelativeModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
                <EditRelativeModal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} relative={selectedRelative} />
                <EditBioModal isOpen={isEditBioModalOpen} onOpenChange={setIsEditBioModalOpen} bio={user.bio} />
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onOpenChange={setIsDeleteModalOpen}
                    title={t("areYouSure")}
                    description={t("deleteRelativeConfirmation")}
                    onConfirm={confirmDelete}
                    loading={isDeleting}
                    confirmText={t("confirmDelete")}
                />
            </div>
        </div>
    );
};

export default ProfilePage;