"use client";

import { useState } from "react";
import { useGetAllAudioQuery } from "@/lib/features/api/chattingApi";
import CustomPagination from "@/components/common/CustomPagination";
import ConversationAudioCardSkeleton from "@/components/skeleton/ConversationAudioCardSkeleton";
import TrendingAudioCard from "@/components/chatting/trending/TrendingAudioCard";
import LoadFailed from "@/components/common/LoadFailed";
import NoData from "@/components/common/NoData";
import { useTranslations } from "next-intl";
import Title from "@/components/ui/Title";

const ConversationsPage = () => {
  const t = useTranslations("ConversationsPage");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, error } = useGetAllAudioQuery({ page, limit });

  const audios = data?.data?.result || [];
  const meta = data?.data?.meta || {};

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title>
          {t("conversations")}
        </Title>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: limit }).map((_, index) => (
            <ConversationAudioCardSkeleton key={index} />
          ))
        ) : isError ? (
          <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
            <LoadFailed msg={error?.message || t("errorLoadingConversations")} />
          </div>
        ) : audios.length === 0 ? (
          <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
            <NoData msg={t("noConversationsFound")} />
          </div>
        ) : (
          audios.map((audio) => (
            <TrendingAudioCard key={audio._id} audio={audio} />
          ))
        )}
      </div>

      {meta.totalPages > 1 && !isLoading && !isError && audios.length > 0 && (
        <div className="mt-8 flex justify-center">
          <CustomPagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;