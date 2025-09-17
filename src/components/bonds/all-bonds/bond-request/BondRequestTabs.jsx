'use client';

import { useState } from 'react';
import Title from '@/components/ui/Title';
import { useTranslations } from 'next-intl';
import { useGetMyBondsRequestQuery, useDeleteRequestBondMutation, useUpdateRequestBondMutation } from '@/lib/features/api/bondsApi';
import BondRequestCard from './BondRequestCard';
import { Skeleton } from '@/components/ui/skeleton';
import NoData from '@/components/common/NoData';
import CustomPagination from '@/components/common/CustomPagination';
import { Input } from '@/components/ui/input';
import LoadFailed from '@/components/common/LoadFailed';
import MatchingBondsModal from '../../MatchingBondsModal';
import EditBondRequestModal from './EditBondRequestModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { toast } from 'sonner';

export default function BondRequestTabs() {
  const t = useTranslations('Bonds');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // State for modals
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // State for the currently selected request for modals
  const [selectedRequest, setSelectedRequest] = useState(null);

  const { data: bondRequests, isLoading, isError } = useGetMyBondsRequestQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm
  });
  const [deleteRequestBond, { isLoading: isDeleting }] = useDeleteRequestBondMutation();
  const [updateRequestBond,] = useUpdateRequestBondMutation();

  const totalPages = bondRequests?.data?.meta?.totalPage;

  // Handlers to open modals
  const handleFindMatch = (request) => {
    setSelectedRequest(request);
    setIsMatchModalOpen(true);
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

  const handleDelete = (request) => {
    setSelectedRequest(request);
    setIsDeleteModalOpen(true);
  };

  const handlePause = async (request) => {
    try {
      await updateRequestBond({ id: request._id, data: { isPause: !request.isPause } }).unwrap();
      toast.success(`Bond request ${request.isPause ? 'unpaused' : 'paused'} successfully!`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update bond request status.');
    }
  };

  const confirmDelete = async () => {
    if (!selectedRequest) return;
    try {
      await deleteRequestBond(selectedRequest._id).unwrap();
      toast.success("Bond request deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete bond request.");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center my-6">
        <Title>{t('bondRequests')}</Title>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-64"
          />
        </div>
      </div>

      <div className='md:mt-12'>
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-42 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <LoadFailed msg="Failed to fetch bond requests." />
        ) : bondRequests?.data?.result?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {bondRequests.data.result.map((request) => (
              <BondRequestCard 
                key={request._id} 
                request={request} 
                onFindMatch={handleFindMatch} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPause={handlePause}
              />
            ))}
          </div>
        ) : (
          <NoData msg="No bond requests found." />
        )}
      </div>

      {bondRequests?.data?.result?.length > 0 && totalPages > 1 && (
        <div className="my-4">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {selectedRequest && (
        <>
          <MatchingBondsModal
            isOpen={isMatchModalOpen}
            onOpenChange={setIsMatchModalOpen}
            bondRequestId={selectedRequest._id}
          />
          <EditBondRequestModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            request={selectedRequest}
          />
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            title="Are you sure?"
            description="This will permanently delete this bond request. This action cannot be undone."
            onConfirm={confirmDelete}
            loading={isDeleting}
            confirmText="Delete"
          />
        </>
      )}
    </>
  );
}