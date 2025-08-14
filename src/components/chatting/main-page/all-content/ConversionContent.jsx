import ConversationAudioCardSkeleton from '@/components/skeleton/ConversationAudioCardSkeleton';
import { Button } from '@/components/ui/button';
import { useGetAllAudioQuery } from '@/lib/features/api/chattingApi';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import TrendingAudioCard from '../../trending/TrendingAudioCard';

const ConversionContent = () => {
    const { data, isLoading, isError } = useGetAllAudioQuery();

    const audios = data?.data?.result || [];


    if (isLoading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-6">Conversations</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <ConversationAudioCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return <div className="text-center text-red-500 min-h-minus-header">Error loading conversations.</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg font-bold text-primary dark:text-white">Discover Conversations You’ll Love</h1>
                <Link href="/chatting/conversations" passHref>
                    <Button variant="ghost" size="sm" className="text-primary dark:text-white">
                        See all <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {audios.length > 0 ? (
                    audios.slice(0, 4).map((audio) => (
                        <TrendingAudioCard key={audio._id} audio={audio} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">No conversations found.</p>
                )}
            </div>
        </div>
    );
};

export default ConversionContent;