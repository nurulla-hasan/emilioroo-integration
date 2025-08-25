'use client';

import MatchGroup from './MatchGroup';
import { Skeleton } from '@/components/ui/skeleton';
import NoData from '@/components/common/NoData';
import LoadFailed from '@/components/common/LoadFailed';
import { useGetMatchingBondsQuery } from '@/lib/features/api/bondsApi';

export default function MatchingBonds({ bondRequestId }) {
  const { data: matchingData, isLoading, isError } = useGetMatchingBondsQuery(
    bondRequestId,
    { skip: !bondRequestId }
);

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

  return (
    <div className="space-y-4 p-1 max-h-[60vh] overflow-y-auto">
      {matchingData?.data?.length > 0 ? (
        matchingData.data.map((match, index) => (
          <MatchGroup key={index} matchRequest={match.matchRequest} />
        ))
      ) : (
        <NoData msg="No matches found for this request." />
      )}
    </div>
  );
}