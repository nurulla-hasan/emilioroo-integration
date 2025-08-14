import TrendingTopicCardSkeleton from '@/components/skeleton/TrendingTopicCardSkeleton';
import { useGetAllTopicsQuery } from '@/lib/features/api/chattingApi';
import React from 'react';
import TrendingTopicCard from '../../trending/TrendingTopicCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const TrendingTopicsContent = () => {
    const { data, isLoading, isError } = useGetAllTopicsQuery();

    const topics = data?.data?.result || [];
    return (
        <div>
            <div className='flex justify-between items-center mb-6'>
                <h1 className="text-lg font-bold text-primary dark:text-white">Trending Topics</h1>
                <Link href="/chatting/trending" passHref>
                    <Button variant="ghost" size="sm" className="text-primary dark:text-white">
                        See all <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                    [...Array(4)].map((_, index) => (
                        <TrendingTopicCardSkeleton key={index} />
                    ))
                ) : isError ? (
                    <p className="col-span-full text-center text-red-500">Error loading trending topics.</p>
                ) : topics.length > 0 ? (
                    topics.slice(0, 4).map((topic) => (
                        <TrendingTopicCard key={topic._id} topic={topic} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">No trending topics found.</p>
                )}
            </div>
        </div>
    );
};

export default TrendingTopicsContent;