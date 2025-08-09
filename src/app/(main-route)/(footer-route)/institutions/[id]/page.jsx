"use client";

import { useGetSingleInstitutionQuery, useGetAllInstitutionQuery, useGetInstitutionMembersQuery, useRemoveInstitutionMemberMutation, useGetInstitutionConversationQuery, useCreateInstitutionConversationMutation, useUpdateInstitutionConversationMutation, useDeleteInstitutionConversationMutation } from "@/lib/features/api/InstitutionApi";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Facebook, Instagram, Loader2 } from "lucide-react";
import InstitutionNavCard from "@/components/institutions/single-institution/InstitutionNavCard";
import InstitutionNavCardSkeleton from "@/components/institutions/single-institution/InstitutionNavCardSkeleton";
import Mediators from "@/components/institutions/single-institution/Mediators";
import InstitutionContent from "@/components/institutions/single-institution/InstitutionContent";
import PostFeed from "@/components/institutions/single-institution/posts/PostFeed";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import CreateConversationModal from "@/components/institutions/single-institution/CreateConversationModal";
import EditConversationModal from "@/components/institutions/single-institution/EditConversationModal";

const fakeMediators = [
    { id: 1, name: "MR. Sarwar", title: "Innovators Hub", avatar: "/placeholder-user.jpg" },
    { id: 2, name: "MR. Golap", title: "Change makers", avatar: "/placeholder-user.jpg" },
    { id: 3, name: "MS. Fatima", title: "Pioneers", avatar: "/placeholder-user.jpg" },
    { id: 4, name: "MR. Ahmed", title: "Visionaries", avatar: "/placeholder-user.jpg" },
    { id: 5, name: "MS. Sarah", title: "Trailblazers", avatar: "/placeholder-user.jpg" },
];

const fakePosts = [
    {
        id: 1,
        author: {
            name: "MR. Sarwar",
            title: "CEO",
            avatar: "/placeholder-user.jpg",
        },
        date: "22 May 2025",
        time: "10:30 AM",
        content: "Just shared a new research paper on sustainable packaging materials. Check it out in the resources section!",
        likes: 12,
        comments: 5,
    },
    {
        id: 2,
        author: {
            name: "Ahmad Musa",
            title: "General Manager",
            avatar: "/placeholder-user.jpg",
        },
        date: "21 May 2025",
        time: "2:45 PM",
        content: "Our team has made significant progress on the biodegradable packaging prototype. Looking forward to presenting it next week.",
        likes: 8,
        comments: 3,
    },
];
const SingleInstitutionPage = () => {
    const { id } = useParams();

    // State
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);
    const [isCreateConversationModalOpen, setIsCreateConversationModalOpen] = useState(false);
    const [isEditConversationModalOpen, setIsEditConversationModalOpen] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isDeleteConversationModalOpen, setIsDeleteConversationModalOpen] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState(null);

    // Query
    const { data: singleInstitutionData, isLoading: isSingleInstitutionLoading, isError: isSingleInstitutionError } = useGetSingleInstitutionQuery(id);
    const { data: allInstitutionsData, isLoading: areAllInstitutionsLoading, isError: areAllInstitutionsError } = useGetAllInstitutionQuery();
    const { data: institutionMembersData, refetch: refetchInstitutionMembers } = useGetInstitutionMembersQuery(id);
    const { data: institutionConversationsData, isLoading: areInstitutionConversationsLoading, isError: areInstitutionConversationsError, refetch: refetchInstitutionConversations } = useGetInstitutionConversationQuery(id);
    const [removeInstitutionMember, { isLoading: isRemovingMember }] = useRemoveInstitutionMemberMutation();
    const [createInstitutionConversation, { isLoading: isCreatingConversation }] = useCreateInstitutionConversationMutation();
    const [updateInstitutionConversation, { isLoading: isUpdatingConversation }] = useUpdateInstitutionConversationMutation();
    const [deleteInstitutionConversation, { isLoading: isDeletingConversation }] = useDeleteInstitutionConversationMutation();

    const institution = singleInstitutionData?.data;
    const allInstitutions = allInstitutionsData?.data?.result;
    const institutionMembers = institutionMembersData?.data?.result;
    const institutionConversations = institutionConversationsData?.data;

    const innovators = institutionMembers?.filter(member => member.group === "A") || [];
    const thinkers = institutionMembers?.filter(member => member.group === "B") || [];

    // Handlers
    const handleTopicClick = (topic) => {
        setSelectedTopic(topic);
    };

    const handleEditConversationClick = (conversation) => {
        setSelectedConversation(conversation);
        setIsEditConversationModalOpen(true);
    };

    const handleDeleteConversationClick = (conversation) => {
        setConversationToDelete(conversation);
        setIsDeleteConversationModalOpen(true);
    };

    const handleRemoveMemberClick = (memberId) => {
        setMemberToRemove(memberId);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmRemove = async () => {
        if (memberToRemove) {
            try {
                await removeInstitutionMember(memberToRemove).unwrap();
                refetchInstitutionMembers();
                toast.success("Member removed successfully!");
            } catch (error) {
                console.error("Failed to remove member:", error);
                toast.error(error?.data?.message || "Failed to remove member.");
            } finally {
                setIsConfirmModalOpen(false);
                setMemberToRemove(null);
            }
        }
    };

    const handleCreateConversationClick = () => {
        setIsCreateConversationModalOpen(true);
    };

    const handleCreateConversation = async (data) => {
        try {
            await createInstitutionConversation({ name: data.name, institution: id }).unwrap();
            toast.success("Conversation created successfully!");
            refetchInstitutionConversations();
            setIsCreateConversationModalOpen(false);
        } catch (error) {
            console.error("Failed to create conversation:", error);
            toast.error(error?.data?.message || "Failed to create conversation.");
        }
    };

    const handleUpdateConversation = async (data) => {
        try {
            await updateInstitutionConversation({ id: data._id, data: { name: data.name } }).unwrap();
            toast.success("Conversation updated successfully!");
            refetchInstitutionConversations();
            setIsEditConversationModalOpen(false);
        } catch (error) {
            console.error("Failed to update conversation:", error);
            toast.error(error?.data?.message || "Failed to update conversation.");
        }
    };

    const handleConfirmDeleteConversation = async () => {
        if (conversationToDelete) {
            try {
                await deleteInstitutionConversation(conversationToDelete._id).unwrap();
                toast.success("Conversation deleted successfully!");
                refetchInstitutionConversations();
                setIsDeleteConversationModalOpen(false);
            } catch (error) {
                console.error("Failed to delete conversation:", error);
                toast.error(error?.data?.message || "Failed to delete conversation.");
            }
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] overflow-hidden grid grid-cols-12 gap-8 p-2">
            {/* Sidebar */}
            <div className="hidden lg:block col-span-3 border rounded-lg p-4 overflow-y-auto">
                <div className="flex flex-col gap-2">
                    {areAllInstitutionsLoading && <InstitutionNavCardSkeleton count={7} />}
                    {areAllInstitutionsError && <p className="text-red-500">Error loading institutions.</p>}
                    {allInstitutions && allInstitutions.map(inst => (
                        <InstitutionNavCard key={inst._id} institution={inst} />
                    ))}
                </div>
            </div>
            {/* Main content */}
            <div className="col-span-12 lg:col-span-9 overflow-y-auto border p-3 rounded-lg">
                {isSingleInstitutionLoading && <div>Loading...</div>}
                {isSingleInstitutionError && <p className="text-red-500">Error loading institution.</p>}
                {institution && (
                    <>
                        <div className="relative h-48 w-full bg-card border-b rounded-lg">
                            <Image
                                src={institution.cover_image || "/placeholder.png"}
                                alt={institution.name || "Institution cover"}
                                fill
                                className="object-cover rounded-lg"
                                priority
                            />
                        </div>
                        <div className="py-4 flex justify-between items-start">
                            <div>
                                <h1 className="text-xl font-bold text-primary dark:text-white">{institution.name}</h1>
                                <p className="mt-2 text-sm text-muted-foreground">{institution.description}</p>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                                <Link href={`${institution.facebookLink}`}>
                                    <Facebook className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                </Link>
                                <Link href={`${institution.instagramLink}`}>
                                    <Instagram className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                </Link>
                            </div>
                        </div>
                        <Mediators mediators={fakeMediators} />
                        <InstitutionContent innovators={innovators} thinkers={thinkers} topics={institutionConversations} onTopicClick={handleTopicClick} onEditTopic={handleEditConversationClick} onDeleteTopic={handleDeleteConversationClick} onRemoveMember={handleRemoveMemberClick} onCreateConversationClick={handleCreateConversationClick} isLoading={areInstitutionConversationsLoading} error={areInstitutionConversationsError} />
                        {selectedTopic && <PostFeed posts={fakePosts} />}
                    </>
                )}
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onOpenChange={setIsConfirmModalOpen}
                title="Confirm Removal"
                description="Are you sure you want to remove this member? This action cannot be undone."
                onConfirm={handleConfirmRemove}
                confirmText={isRemovingMember ? <><Loader2 className="h-4 w-4 animate-spin" /> Removing</> : "Remove"}
            />

            <ConfirmationModal
                isOpen={isDeleteConversationModalOpen}
                onOpenChange={setIsDeleteConversationModalOpen}
                title="Confirm Deletion"
                description="Are you sure you want to delete this conversation? This action cannot be undone."
                onConfirm={handleConfirmDeleteConversation}
                confirmText={isDeletingConversation ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting</> : "Delete"}
            />

            <CreateConversationModal
                isOpen={isCreateConversationModalOpen}
                onOpenChange={setIsCreateConversationModalOpen}
                onCreateConversation={handleCreateConversation}
                isLoading={isCreatingConversation}
            />

            <EditConversationModal
                isOpen={isEditConversationModalOpen}
                onOpenChange={setIsEditConversationModalOpen}
                onUpdateConversation={handleUpdateConversation}
                isLoading={isUpdatingConversation}
                topic={selectedConversation}
            />
        </div>
    );
};

export default SingleInstitutionPage;
