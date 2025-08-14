"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetAllAudioQuery } from "@/lib/features/api/chattingApi";
import ConversationAudioCardSkeleton from "@/components/skeleton/ConversationAudioCardSkeleton";
import TrendingAudioCard from "@/components/chatting/trending/TrendingAudioCard";

const TrendingDetailPage = () => {
  const params = useParams();
  const topicId = params.id;

  const { data, isLoading, isError } = useGetAllAudioQuery({ limit: 500 });

  const filteredAudios = useMemo(() => {
    const allAudios = data?.data?.result || [];
    if (!allAudios.length || !topicId) return [];
    return allAudios.filter(audio => audio.audioTopic?._id === topicId);
  }, [data, topicId]);


  if (isLoading) {
    return (
      <div className="px-4 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(10)].map((_, index) => (
            <ConversationAudioCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 px-4 lg:px-0">Error loading audios.</div>;
  }

  return (
    <div className="px-4 lg:px-0">
      <h1 className="text-2xl font-bold mb-6 text-primary dark:text-white">Audios for this Topic</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAudios.length > 0 ? (
          filteredAudios.map((audio) => (
            <TrendingAudioCard key={audio._id} audio={audio} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No audios found for this topic.</p>
        )}
      </div>
    </div>
  );
};

export default TrendingDetailPage;