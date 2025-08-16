"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetAllAudioQuery } from "@/lib/features/api/chattingApi";
import ConversationAudioCardSkeleton from "@/components/skeleton/ConversationAudioCardSkeleton";
import TrendingAudioCard from "@/components/chatting/trending/TrendingAudioCard";
import { useTranslations } from 'next-intl';

const TrendingDetailPage = () => {
  const t = useTranslations('TrendingDetailPage');
  const params = useParams();
  const topicId = params.id;

  const { data, isLoading, isError } = useGetAllAudioQuery({ limit: 500 });

  const filteredAudios = useMemo(() => {
    const allAudios = data?.data?.result || [];
    if (!allAudios.length || !topicId) return [];
    return allAudios.filter(audio => audio.audioTopic?._id === topicId);
  }, [data, topicId]);

  let content;

  if (isLoading) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(12)].map((_, index) => (
          <ConversationAudioCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    content = (
      <div className="text-center py-10 text-red-500">{t('errorLoadingAudios')}</div>
    );
  }

  if (filteredAudios.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAudios.map((audio) => (
          <TrendingAudioCard key={audio._id} audio={audio} />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-0">
      <h1 className="text-2xl font-bold mb-6 text-primary dark:text-white">{t('audiosForTopic')}</h1>
      {content}
    </div>
  );
};

export default TrendingDetailPage;