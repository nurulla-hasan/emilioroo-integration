import TrendingTopicCardSkeleton from '@/components/skeleton/TrendingTopicCardSkeleton';
import { useGetAllTopicsQuery } from '@/lib/features/api/chattingApi';
import React from 'react';
import TrendingTopicCard from '../../trending/TrendingTopicCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from "next-intl";
import Title2 from '@/components/ui/Title2';
import NoData from '@/components/common/NoData';
import LoadFailed from '@/components/common/LoadFailed';

const TrendingTopicsContent = () => {
    const t = useTranslations('Chatting');
    const { data, isLoading, isError } = useGetAllTopicsQuery();

    const topics = data?.data?.result || [];
    return (
        <>
            <div className='flex justify-between items-center mb-6'>
                <Title2>{t('trendingTopicsTitle')}</Title2>
                <Link href="/chatting/trending" passHref>
                    <Button variant="ghost" size="sm" className="text-primary dark:text-white">
                        {t('seeAll')} <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                    [...Array(4)].map((_, index) => (
                        <TrendingTopicCardSkeleton key={index} />
                    ))
                ) : isError ? (
                    <div className="col-span-full mx-auto">
                        <LoadFailed msg={t('errorLoadingTrendingTopics')} />
                    </div>
                ) : topics.length > 0 ? (
                    topics.slice(0, 4).map((topic) => (
                        <TrendingTopicCard key={topic._id} topic={topic} />
                    ))
                ) : (
                    <div className="col-span-full mx-auto">
                       <NoData msg= {t('noTrendingTopicsFound')} />
                    </div>
                )}
            </div>
        </>
    );
};

export default TrendingTopicsContent;