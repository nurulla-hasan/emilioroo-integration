'use client';

import { useState } from 'react';
import Title from '@/components/ui/Title';
import { useTranslations } from 'next-intl';
import { useGetMyBondsRequestQuery } from '@/lib/features/api/bondsApi';
import BondRequestCard from './BondRequestCard';
import { Skeleton } from '@/components/ui/skeleton';
import NoData from '@/components/common/NoData';
import CustomPagination from '@/components/common/CustomPagination';
import { Input } from '@/components/ui/input';
import LoadFailed from '@/components/common/LoadFailed';

export default function BondRequestTabs() {
  const t = useTranslations('Bonds');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: bondRequests, isLoading, isError } = useGetMyBondsRequestQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm
  });

  const totalPages = bondRequests?.data?.meta?.totalPage;

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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-42 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <LoadFailed msg="Failed to fetch bond requests." />
        ) : bondRequests?.data?.result?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {bondRequests.data.result.map((request) => (
              <BondRequestCard key={request._id} request={request} />
            ))}
          </div>
        ) : (
          <NoData msg="No bond requests found." />
        )}
      </div>

      {bondRequests?.data?.result?.length > 0 && totalPages > 1 && (
        <div className="my-4 absolute bottom-0 right-0 left-0">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </>
  );
}
