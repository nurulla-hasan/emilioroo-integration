import useGetFavoriteIds from '@/hooks/useGetFavoriteIds';
import { useGetAllAudioQuery } from '@/lib/features/api/chattingApi';
import React from 'react';
import AudioCard from '../../AudioCard';
import AudioCardSkeleton from '@/components/skeleton/AudioCardSkeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const MostPlayedContent = () => {

    const { data, isLoading, isError } = useGetAllAudioQuery();
    const [favouriteIds] = useGetFavoriteIds();

    const audios = data?.data?.result || [];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg font-bold text-primary dark:text-white">Most Played In This Week</h1>
                <Link href="/chatting/most-played" passHref>
                    <Button variant="ghost" size="sm" className="text-primary dark:text-white">
                        See all <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4  gap-6">
                {audios?.length > 0 ? (
                    audios?.slice(0, 4).map((audio) => (
                        <AudioCard key={audio._id} audio={audio} favouriteIds={favouriteIds} />
                    ))
                ) : (!isLoading && !isError) && (
                    audios?.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">No most played audios found.</p>
                    )
                )}
                {isLoading && [...Array(4)].map((_, index) => (
                    <AudioCardSkeleton key={index} />
                ))}
                {isError && <p className="col-span-full text-center text-red-500">Error loading most played audios.</p>}
            </div>
        </div>
    );
};

export default MostPlayedContent;