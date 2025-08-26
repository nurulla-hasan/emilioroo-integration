import useGetFavoriteIds from '@/hooks/useGetFavoriteIds';
import { useGetAllAudioQuery } from '@/lib/features/api/chattingApi';
import React from 'react';
import AudioCard from '../../AudioCard';
import AudioCardSkeleton from '@/components/skeleton/AudioCardSkeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from "next-intl";
import Title2 from '@/components/ui/Title2';
import LoadFailed from '@/components/common/LoadFailed';
import NoData from '@/components/common/NoData';

const MostPlayedContent = () => {
    const t = useTranslations('Chatting');

    const { data, isLoading, isError } = useGetAllAudioQuery();
    const [favouriteIds] = useGetFavoriteIds();

    const audios = data?.data?.result || [];

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <Title2>{t('mostPlayedInThisWeek')}</Title2>
                <Link href="/chatting/most-played" passHref>
                    <Button variant="ghost" size="sm" className="text-primary dark:text-white">
                        {t('seeAll')} <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {
                    isLoading ? (
                        [...Array(4)].map((_, index) => (
                            <AudioCardSkeleton key={index} />
                        ))
                    ) : isError ? (
                        <div className="col-span-full mx-auto">
                            <LoadFailed msg={t('errorLoadingMostPlayedAudios')} />
                        </div>
                    ) : audios?.length > 0 ? (
                        audios.slice(0, 4).map((audio) => (
                            <AudioCard key={audio._id} audio={audio} favouriteIds={favouriteIds} />
                        ))
                    ) : (
                        <div className="col-span-full mx-auto">
                            <NoData msg={t('noMostPlayedAudiosFound')} />
                        </div>
                    )
                }
            </div>
        </>
    );
};

export default MostPlayedContent;