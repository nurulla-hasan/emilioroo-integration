"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetAllAudioQuery } from "@/lib/features/api/chattingApi";
import ConversationAudioCardSkeleton from "@/components/skeleton/ConversationAudioCardSkeleton";
import TrendingAudioCard from "@/components/chatting/trending/TrendingAudioCard";
import LoadFailed from "@/components/common/LoadFailed";
import NoData from "@/components/common/NoData";
import { useTranslations } from "next-intl";
import Title from "@/components/ui/Title";

const TrendingDetailPage = () => {
  const t = useTranslations("TrendingDetailPage");
  const params = useParams();
  const topicId = params.id;

  const { data, isLoading, isError, error } = useGetAllAudioQuery({ limit: 500 });

  const filteredAudios = useMemo(() => {
    const allAudios = data?.data?.result || [];
    if (!allAudios.length || !topicId) return [];
    return allAudios.filter(audio => audio.audioTopic?._id === topicId);
  }, [data, topicId]);

  return (
    <div className="px-4 lg:px-0">
      <div className="flex justify-between items-center mb-6">
        <Title>
        {t("audiosForTopic")}
      </Title>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <ConversationAudioCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
          <LoadFailed msg={error?.message || t("errorLoadingAudios")} />
        </div>
      ) : filteredAudios.length === 0 ? (
        <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
          <NoData msg={t("noAudiosFoundOnThisTopic")} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAudios.map((audio) => (
            <TrendingAudioCard key={audio._id} audio={audio} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingDetailPage;