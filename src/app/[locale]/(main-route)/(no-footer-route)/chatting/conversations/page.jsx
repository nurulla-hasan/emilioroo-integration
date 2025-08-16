"use client";

import { useState } from "react";
import { useGetAllAudioQuery } from "@/lib/features/api/chattingApi";
import CustomPagination from "@/components/common/CustomPagination"; 
import ConversationAudioCardSkeleton from "@/components/skeleton/ConversationAudioCardSkeleton";
import TrendingAudioCard from "@/components/chatting/trending/TrendingAudioCard";
import { useTranslations } from 'next-intl';

const ConversationsPage = () => {
  const t = useTranslations('ConversationsPage');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);


  const { data, isLoading, isError } = useGetAllAudioQuery({ page, limit });

  const audios = data?.data?.result || [];
  const meta = data?.data?.meta || {};

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };


  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">{t('conversations')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(limit)].map((_, index) => (
            <ConversationAudioCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 min-h-minus-header">{t('errorLoadingConversations')}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary dark:text-white">{t('conversations')}</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {audios.length > 0 ? (
          audios.map((audio) => (
            <TrendingAudioCard key={audio._id} audio={audio} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">{t('noConversationsFound')}</p>
        )}
      </div>
      {meta.totalPage > 1 && (
        <div className="mt-8 flex justify-center">
          <CustomPagination
            currentPage={meta.page}
            totalPage={meta.totalPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;