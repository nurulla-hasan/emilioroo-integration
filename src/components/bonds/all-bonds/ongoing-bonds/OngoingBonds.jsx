"use client";

import LoadFailed from "@/components/common/LoadFailed";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOngoingBondsQuery } from "@/lib/features/api/bondsApi";
import { useState } from "react";
import MatchGroup from "../../MatchGroup";
import CustomPagination from "@/components/common/CustomPagination";
import NoData from "@/components/common/NoData";
import { useTranslations } from "next-intl";

const OngoingBonds = () => {
  const t = useTranslations('BondRequestTabs');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  const { data, isLoading, isError } = useGetOngoingBondsQuery({
    status: "Ongoing",
    page: currentPage,
    limit: pageSize,
  });

  if (isLoading) {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-60 w-full" />
        ))}
      </div>
    );
  }
  if (isError) {
    return <LoadFailed />;
  }

  const bonds = data?.data?.result || [];
  const totalPages = data?.data?.meta?.totalPage || 1;

  return (
    <div>
      {bonds.length > 0 ? (
        <>
          <div className="space-y-4">
            {bonds.map((bond) => (
              <MatchGroup
                key={bond._id}
                matchRequest={bond.requestedBonds}
                status={bond.status}
                showProposeButton={false}
              />
            ))}
          </div>
          {bonds.length > 0 && totalPages > 1 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <NoData msg={t('noOngoingBonds')} />
      )}
    </div>
  );
};

export default OngoingBonds;