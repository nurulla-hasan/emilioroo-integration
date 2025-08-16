"use client";

import { useState } from "react";
import { useGetAllTopicsQuery } from "@/lib/features/api/chattingApi";
import TrendingTopicCard from "@/components/chatting/trending/TrendingTopicCard";
import CustomPagination from "@/components/common/CustomPagination";
import TrendingTopicCardSkeleton from "@/components/skeleton/TrendingTopicCardSkeleton";
import { useTranslations } from 'next-intl';

const TrendingPage = () => {
  const t = useTranslations('TrendingPage');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError } = useGetAllTopicsQuery({ page, limit });

  const topics = data?.data?.result || [];
  const meta = data?.data?.meta || {};

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary dark:text-white">{t('trendingTopics')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          [...Array(limit)].map((_, index) => (
            <TrendingTopicCardSkeleton key={index} />
          ))
        ) : isError ? (
          <p className="col-span-full text-center text-red-500">{t('errorLoadingTrendingTopics')}</p>
        ) : topics.length > 0 ? (
          topics.map((topic) => (
            <TrendingTopicCard key={topic._id} topic={topic} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">{t('noTrendingTopicsFound')}</p>
        )}
      </div>

      {meta.totalPage > 1 && !isLoading && !isError && ( 
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

export default TrendingPage;