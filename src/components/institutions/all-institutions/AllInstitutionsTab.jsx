import CardSkeleton from '@/components/skeleton/CardSkeleton';
import React from 'react';
import AllInstitutionsCard from './AllInstitutionsCard';
import CustomPagination from '@/components/common/CustomPagination';
import NoData from '@/components/common/NoData';
import LoadFailed from '@/components/common/LoadFailed';

const AllInstitutionsTab = ({ data, isLoading, isError, currentPage, setCurrentPage, pageSize, totalPages, t }) => {
    return (
        <>
            <div className="mt-4">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(pageSize)].map((_, index) => (
                            <CardSkeleton key={index} />
                        ))}
                    </div>
                ) : isError ? (
                    <LoadFailed msg={t('errorFetchingInstitutions')} />
                ) : Array.isArray(data?.data?.result) && data.data.result.length === 0 ? (
                    <NoData msg={t('noInstitutionsFound')} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {data.data.result.map((institution) => (
                            <AllInstitutionsCard key={institution._id} institution={institution} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && !isError && totalPages > 1 && (
                    <div className="my-4 absolute bottom-0 right-0 left-0">
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default AllInstitutionsTab;