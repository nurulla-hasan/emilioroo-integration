"use client";

import { useGetSingleInstitutionQuery, useGetAllInstitutionQuery, useGetInstitutionMembersQuery, useRemoveInstitutionMemberMutation, useGetInstitutionConversationQuery, useCreateInstitutionConversationMutation, useUpdateInstitutionConversationMutation, useDeleteInstitutionConversationMutation, useGetConversationCommentsQuery } from "@/lib/features/api/InstitutionApi";
import { useParams } from "next/navigation";
import InstitutionNavCard from "@/components/institutions/single-institution/InstitutionNavCard";
import InstitutionNavCardSkeleton from "@/components/skeleton/InstitutionNavCardSkeleton";
import Mediators from "@/components/institutions/single-institution/Mediators";
import InstitutionContent from "@/components/institutions/single-institution/InstitutionContent";
import PostFeed from "@/components/institutions/single-institution/posts/PostFeed";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import CreateConversationModal from "@/components/institutions/single-institution/CreateConversationModal";
import EditConversationModal from "@/components/institutions/single-institution/EditConversationModal";
import InstitutionHeader from "@/components/institutions/single-institution/InstitutionHeader";
import InstitutionHeaderSkeleton from "@/components/skeleton/InstitutionHeaderSkeleton";
import MediatorsSkeleton from "@/components/skeleton/MediatorsSkeleton";
import InstitutionContentSkeleton from "@/components/skeleton/InstitutionContentSkeleton";

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
    const { data: conversationCommentsData, isError: areConversationCommentsError, isFetching: isFetchingConversationComments } = useGetConversationCommentsQuery(selectedTopic?._id, { skip: !selectedTopic });
    const [removeInstitutionMember, { isLoading: isRemovingMember }] = useRemoveInstitutionMemberMutation();
    const [createInstitutionConversation, { isLoading: isCreatingConversation }] = useCreateInstitutionConversationMutation();
    const [updateInstitutionConversation, { isLoading: isUpdatingConversation }] = useUpdateInstitutionConversationMutation();
    const [deleteInstitutionConversation, { isLoading: isDeletingConversation }] = useDeleteInstitutionConversationMutation();

    const institution = singleInstitutionData?.data;
    const allInstitutions = allInstitutionsData?.data?.result;
    const institutionMembers = institutionMembersData?.data?.result;
    const institutionConversations = institutionConversationsData?.data?.result;
    const conversationComments = conversationCommentsData?.data?.result;

    const innovators = institutionMembers?.filter(member => member.group === "A") || [];
    const thinkers = institutionMembers?.filter(member => member.group === "B") || [];
    const mediators = institutionMembers?.filter(member => member.group === "Mediator") || [];

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
            await createInstitutionConversation({ ...data, institution: id }).unwrap();
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
            await updateInstitutionConversation({ id: data._id, data: { name: data.name, isPublic: data.isPublic } }).unwrap();
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
        <div className="h-[calc(100vh-80px)] overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-2">
            {/* Sidebar */}
            <div className="hidden xl:block col-span-3 border rounded-lg p-4 overflow-y-auto">
                <div className="flex flex-col gap-2">
                    {areAllInstitutionsLoading ? (
                        <InstitutionNavCardSkeleton count={7} />
                    ) : areAllInstitutionsError ? (
                        <p className="text-red-500">Error loading institutions.</p>
                    ) : (
                        allInstitutions && allInstitutions.map(inst => (
                            <InstitutionNavCard key={inst._id} institution={inst} isActive={inst._id === id} />
                        ))
                    )}
                </div>
            </div>
            {/* Main content */}
            <div className="col-span-12 xl:col-span-9 overflow-y-auto border p-3 rounded-lg">
                {isSingleInstitutionLoading ? (
                    <>
                        <InstitutionHeaderSkeleton />
                        <MediatorsSkeleton />
                        <InstitutionContentSkeleton />
                    </>
                ) : isSingleInstitutionError ? (
                    <p className="text-red-500">Error loading institution.</p>
                ) : (
                    institution && (
                        <>
                            <InstitutionHeader institution={institution} />
                            <Mediators mediators={mediators} />
                            <InstitutionContent
                                institution={institution}
                                innovators={innovators}
                                thinkers={thinkers}
                                topics={institutionConversations}
                                selectedTopic={selectedTopic}
                                onTopicClick={handleTopicClick}
                                onEditTopic={handleEditConversationClick}
                                onDeleteTopic={handleDeleteConversationClick}
                                onRemoveMember={handleRemoveMemberClick}
                                onCreateConversationClick={handleCreateConversationClick}
                                isLoading={areInstitutionConversationsLoading}
                                error={areInstitutionConversationsError}
                            />
                            <PostFeed
                                posts={conversationComments}
                                selectedTopic={selectedTopic}
                                isFetching={isFetchingConversationComments}
                                isError={areConversationCommentsError}
                            />
                        </>
                    )
                )}
            </div>

            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onOpenChange={setIsConfirmModalOpen}
                title="Confirm Removal"
                description="Are you sure you want to remove this member? This action cannot be undone."
                onConfirm={handleConfirmRemove}
                confirmText="Remove"
                loading={isRemovingMember}
            />

            <ConfirmationModal
                isOpen={isDeleteConversationModalOpen}
                onOpenChange={setIsDeleteConversationModalOpen}
                title="Confirm Deletion"
                description="Are you sure you want to delete this conversation? This action cannot be undone."
                onConfirm={handleConfirmDeleteConversation}
                confirmText="Delete"
                loading={isDeletingConversation}
            />

            {/*{/* Modals */}
            <CreateConversationModal
                isOpen={isCreateConversationModalOpen}
                onOpenChange={setIsCreateConversationModalOpen}
                onCreateConversation={handleCreateConversation}
                isLoading={isCreatingConversation}
            />
            {/* <EditConversationModal */}
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
