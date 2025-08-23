'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Handshake, MapPin, Pencil, Trash2, Pause } from "lucide-react";
import { useDeleteRequestBondMutation } from "@/lib/features/api/bondsApi";
import { toast } from "sonner";
import ConfirmationModal from '@/components/common/ConfirmationModal';
import EditBondRequestModal from './EditBondRequestModal';
import { Separator } from '@/components/ui/separator';
import { timeAgo } from '@/lib/utils';

export default function BondRequestCard({ request }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteRequestBond, { isLoading: isDeleting }] = useDeleteRequestBondMutation();

  const handlePause = () => {
    toast.info("Pause functionality is not implemented yet.");
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRequestBond(request._id).unwrap();
      toast.success("Bond request deleted successfully!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete bond request.");
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-500" />
            <span className="font-semibold">Offer: {request.offer}</span>
          </div>
          <Badge variant="outline">{request.status}</Badge>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-2 pl-7">
          <div className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-green-500" />
            <span className="font-semibold">Want: {request.want}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="h-5 w-5" />
            <span>Radius: {request.radius} km</span>
          </div>
        </div>

        <Separator className="my-1" />

        {/* Footer */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Created ({timeAgo(request.createdAt)})
          </p>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={handlePause}>
                <Pause className="h-4 w-4 text-yellow-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Are you sure?"
        description="This will permanently delete this bond request. This action cannot be undone."
        onConfirm={confirmDelete}
        loading={isDeleting}
        confirmText="Delete"
      />

      <EditBondRequestModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        request={request}
      />
    </>
  );
}
