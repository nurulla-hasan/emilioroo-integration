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
// import EditBondRequestModal from './EditBondRequestModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { toast } from 'sonner';

export default function BondRequestTabs() {
  const t = useTranslations('Bonds');
  const tabsT = useTranslations('BondRequestTabs');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // State for modals
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // State for the currently selected request for modals
  const [selectedRequest, setSelectedRequest] = useState(null);

  const { data: bondRequests, isLoading, isError } = useGetMyBondsRequestQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm
  });
  const [deleteRequestBond, { isLoading: isDeleting }] = useDeleteRequestBondMutation();
  const [updateRequestBond, { isLoading: isUpdating }] = useUpdateRequestBondMutation();

  const totalPages = bondRequests?.data?.meta?.totalPage;

  // Handlers to open modals
  const handleFindMatch = (request) => {
    setSelectedRequest(request);
    setIsMatchModalOpen(true);
  };

  // const handleEdit = (request) => {
  //   setSelectedRequest(request);
  //   setIsEditModalOpen(true);
  // };

  const handleDelete = (request) => {
    setSelectedRequest(request);
    setIsDeleteModalOpen(true);
  };

  const handlePause = async (request) => {
    try {
      await updateRequestBond({ id: request._id, data: { isPause: !request.isPause } }).unwrap();
      toast.success(request.isPause ? tabsT('requestUnpaused') : tabsT('requestPaused'));
    } catch (error) {
      toast.error(error?.data?.message || tabsT('failedToUpdateStatus'));
    }
  };

  const confirmDelete = async () => {
    if (!selectedRequest) return;
    try {
      await deleteRequestBond(selectedRequest._id).unwrap();
      toast.success(tabsT("requestDeleted"));
      setIsDeleteModalOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      toast.error(error?.data?.message || tabsT("failedToDelete"));
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center my-6">
        <Title>{t('bondRequests')}</Title>
        <div className="flex items-center gap-2">
          <Input
            placeholder={tabsT('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-64"
          />
        </div>
      </div>

      <div className='md:mt-12'>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-50 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <LoadFailed msg={tabsT('failedToFetch')} />
        ) : bondRequests?.data?.result?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bondRequests.data.result.map((request) => (
              <BondRequestCard 
                key={request._id} 
                request={request} 
                onFindMatch={handleFindMatch} 
                // onEdit={handleEdit}
                onDelete={handleDelete}
                onPause={handlePause}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        ) : (
          <NoData msg={tabsT('noRequestsFound')} />
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
          {/* <EditBondRequestModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            request={selectedRequest}
          /> */}
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            title={tabsT('areYouSure')}
            description={tabsT('deleteDescription')}
            onConfirm={confirmDelete}
            loading={isDeleting}
            confirmText={tabsT('delete')}
          />
        </>      )}
    </>
  );
}
