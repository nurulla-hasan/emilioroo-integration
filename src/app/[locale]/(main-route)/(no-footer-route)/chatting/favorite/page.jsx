"use client";

import { useGetBookmarkAudioQuery } from "@/lib/features/api/chattingApi";
import AudioCard from "@/components/chatting/AudioCard";
import AudioCardSkeleton from '@/components/skeleton/AudioCardSkeleton';
import { useTranslations } from 'next-intl';

const FavoritePage = () => {
    const t = useTranslations('FavoritePage');
    const { data: bookmarkData, isLoading, isError, error } = useGetBookmarkAudioQuery();
    const bookmarks = bookmarkData?.data || [];
    const favouriteIds = bookmarks?.map(bookmark => bookmark?.audio?._id)

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary dark:text-white">{t('myFavorite')}</h1>
            </div>
            <div>
                {
                    isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => <AudioCardSkeleton key={i} />)}
                        </div>
                    ) : isError ? (
                        <div className="text-red-500 text-center py-10">{t('error')}: {error.message}</div>
                    ) : bookmarks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {bookmarks.map(bookmark => (
                                <AudioCard key={bookmark._id} audio={bookmark.audio} favouriteIds={favouriteIds} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">{t('noBookmarkedAudio')}</div>
                    )
                }
            </div>
        </div>
    );
};

export default FavoritePage;