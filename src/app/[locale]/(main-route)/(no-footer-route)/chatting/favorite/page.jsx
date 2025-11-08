"use client";

import { useState } from "react";
import { useGetBookmarkAudioQuery } from "@/lib/features/api/chattingApi";
import AudioCard from "@/components/chatting/AudioCard";
import AudioCardSkeleton from '@/components/skeleton/AudioCardSkeleton';
import { useTranslations } from 'next-intl';
import Title from "@/components/ui/Title";
import LoadFailed from "@/components/common/LoadFailed";
import NoData from "@/components/common/NoData";
import CustomPagination from "@/components/common/CustomPagination";

const FavoritePage = () => {
    const t = useTranslations('FavoritePage');
    const [currentPage, setCurrentPage] = useState(1);
    const { data: bookmarkData, isLoading, isError, error } = useGetBookmarkAudioQuery({ page: currentPage, limit: 12 });
    const bookmarks = bookmarkData?.data || [];
    const meta = bookmarkData?.meta || {};
    const totalPages = meta?.totalPages || 1;
    const favouriteIds = bookmarks?.map(bookmark => bookmark?.audio?._id);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <Title>{t('myFavorite')}</Title>
            </div>

            <>
                {
                    isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <AudioCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
                            <LoadFailed msg={error?.message || "Error loading favourite"} />
                        </div>
                    ) : bookmarks.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {bookmarks.map(bookmark => (
                                    <AudioCard
                                        key={bookmark.audio._id}
                                        audio={bookmark.audio}
                                        favouriteIds={favouriteIds}
                                    />
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div className="my-6">
                                    <CustomPagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
                            <NoData msg={t('noBookmarkedAudio')} />
                        </div>
                    )
                }
            </>
        </div>
    );
};

export default FavoritePage;