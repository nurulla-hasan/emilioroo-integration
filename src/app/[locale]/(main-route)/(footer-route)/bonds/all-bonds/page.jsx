"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import MyBonds from '@/components/bonds/all-bonds/my-bonds/MyBonds';
import BondRequestTabs from '@/components/bonds/all-bonds/bond-request/BondRequestTabs';
import { useCreateMyBondMutation, useGetMyBondsQuery, useUpdateMyBondMutation, useDeleteMyBondMutation } from '@/lib/features/api/bondsApi';
import { toast } from 'sonner';
import EditBondModal from '@/components/bonds/all-bonds/my-bonds/EditBondModal';
import AddNewBondModal from '@/components/bonds/all-bonds/my-bonds/AddNewBondModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const AllBonds = () => {
    const [createMyBond, { isLoading: isCreatingBond }] = useCreateMyBondMutation();
    const { data: myBonds, isLoading: isMyBondsLoading, refetch: refetchMyBonds } = useGetMyBondsQuery();
    const [updateBond, { isLoading: isUpdatingBond }] = useUpdateMyBondMutation();
    const [deleteBond, { isLoading: isDeletingBond }] = useDeleteMyBondMutation();

    const [isEditBondModalOpen, setIsEditBondModalOpen] = useState(false);
    const [selectedBond, setSelectedBond] = useState(null);
    const [isAddBondModalOpen, setIsAddBondModalOpen] = useState(false);
    const [isDeleteBondModalOpen, setIsDeleteBondModalOpen] = useState(false);
    const [bondToDelete, setBondToDelete] = useState(null);

    const handleCreateBond = async (data) => {
        try {
            await createMyBond(data).unwrap();
            toast.success("Bond created successfully!");
            refetchMyBonds();
            setIsAddBondModalOpen(false);
        } catch (error) {
            console.error("Failed to create bond:", error);
            toast.error(error?.data?.message || "Failed to create bond.");
        }
    };

    const handleEditBondClick = (bond) => {
        setSelectedBond(bond);
        setIsEditBondModalOpen(true);
    };

    const handleDeleteBondClick = (bond) => {
        setBondToDelete(bond);
        setIsDeleteBondModalOpen(true);
    };

    const handleUpdateBond = async (data) => {
        try {
            await updateBond({ id: data.id, data: { offer: data.offer, want: data.want, tag: data.tag } }).unwrap();
            toast.success("Bond updated successfully!");
            refetchMyBonds();
            setIsEditBondModalOpen(false);
        } catch (error) {
            console.error("Failed to update bond:", error);
            toast.error(error?.data?.message || "Failed to update bond.");
        }
    };

    const handleConfirmDeleteBond = async () => {
        if (bondToDelete) {
            try {
                await deleteBond(bondToDelete._id).unwrap();
                toast.success("Bond deleted successfully!");
                refetchMyBonds();
                setIsDeleteBondModalOpen(false);
            } catch (error) {
                console.error("Failed to delete bond:", error);
                toast.error(error?.data?.message || "Failed to delete bond.");
            }
        }
    };

    const handleOpenAddBondModal = () => {
        setIsAddBondModalOpen(true);
    };

    return (
        <div className='min-h-minus-header'>
            <PageLayout>
                <Tabs defaultValue="my-bonds" className="w-full">
                    <TabsList className="flex flex-wrap justify-center md:grid md:grid-cols-4 w-full">
                        <TabsTrigger value="my-bonds">My Bonds</TabsTrigger>
                        <TabsTrigger value="bond-request">Bond Request</TabsTrigger>
                        <TabsTrigger value="ongoing-bonds">Ongoing Bonds</TabsTrigger>
                        <TabsTrigger value="completed-bonds">Completed Bonds</TabsTrigger>
                    </TabsList>
                    <TabsContent value="my-bonds">
                        <div className="mt-4">
                            <MyBonds
                                isLoading={isMyBondsLoading}
                                myBonds={myBonds}
                                onEditBond={handleEditBondClick}
                                onOpenAddBondModal={handleOpenAddBondModal}
                                onDeleteBond={handleDeleteBondClick} />
                        </div>
                    </TabsContent>
                    <TabsContent value="bond-request">
                        <div className="mt-4">
                            <BondRequestTabs />
                        </div>
                    </TabsContent>
                    <TabsContent value="ongoing-bonds">
                        <div className="p-4 border rounded-md mt-4">
                            Ongoing Bonds Content
                        </div>
                    </TabsContent>
                    <TabsContent value="completed-bonds">
                        <div className="p-4 border rounded-md mt-4">
                            Completed Bonds Content
                        </div>
                    </TabsContent>
                </Tabs>
            </PageLayout>


            {/* Modals */}
            <AddNewBondModal
                isOpen={isAddBondModalOpen}
                onOpenChange={setIsAddBondModalOpen}
                onCreateBond={handleCreateBond}
                isLoading={isCreatingBond}
            />
            <EditBondModal
                isOpen={isEditBondModalOpen}
                onOpenChange={setIsEditBondModalOpen}
                onUpdateBond={handleUpdateBond}
                isLoading={isUpdatingBond}
                bond={selectedBond}
            />
            <ConfirmationModal
                isOpen={isDeleteBondModalOpen}
                onOpenChange={setIsDeleteBondModalOpen}
                title="Confirm Deletion"
                description="Are you sure you want to delete this bond? This action cannot be undone."
                onConfirm={handleConfirmDeleteBond}
                confirmText="Delete"
                loading={isDeletingBond}
            />
        </div>
    );
};

export default AllBonds;