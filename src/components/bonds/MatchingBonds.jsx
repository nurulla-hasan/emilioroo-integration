'use client';

import { useState } from 'react';
import MatchGroup from './MatchGroup';
import { Skeleton } from '@/components/ui/skeleton';
import NoData from '@/components/common/NoData';
import LoadFailed from '@/components/common/LoadFailed';
import { useGetMatchingBondsQuery } from '@/lib/features/api/bondsApi';
import CustomPagination from '@/components/common/CustomPagination';

export default function MatchingBonds({ bondRequestId }) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: matchingData, isLoading, isError } = useGetMatchingBondsQuery(
    { bondRequest: bondRequestId, page: currentPage, limit: 10 },
    { skip: !bondRequestId }
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-1">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <LoadFailed msg="Failed to find matches." />;
  }

  const totalPages = matchingData?.data?.total
    ? Math.ceil(matchingData.data.total / matchingData.data.limit)
    : 0;

  return (
    <div className="space-y-4 p-1 max-h-[85vh] overflow-y-auto">
      {matchingData?.data?.data?.length > 0 ? (
        <>
          {matchingData.data.data.map((match, index) => (
            <MatchGroup key={index} matchRequest={match.matchRequest} />
          ))}
          {totalPages > 1 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <NoData msg="No matches found for this request." />
      )}
    </div>
  );
}