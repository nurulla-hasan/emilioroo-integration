"use client";

import { useState } from "react";
import { useGetAllTopicsQuery } from "@/lib/features/api/chattingApi";
import TrendingTopicCard from "@/components/chatting/trending/TrendingTopicCard";
import TrendingTopicCardSkeleton from "@/components/skeleton/TrendingTopicCardSkeleton";
import CustomPagination from "@/components/common/CustomPagination";
import LoadFailed from "@/components/common/LoadFailed";
import NoData from "@/components/common/NoData";
import { useTranslations } from "next-intl";
import Title from "@/components/ui/Title";

const TrendingPage = () => {
  const t = useTranslations("TrendingPage");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, error } = useGetAllTopicsQuery({ page, limit });

  const topics = data?.data?.result || [];
  const meta = data?.data?.meta || {};

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title>
          {t("trendingTopics")}
        </Title>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: limit }).map((_, index) => (
            <TrendingTopicCardSkeleton key={index} />
          ))
        ) : isError ? (
          <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
            <LoadFailed msg={error?.message || t("errorLoadingTrendingTopics")} />
          </div>
        ) : topics.length === 0 ? (
          <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
            <NoData msg={t("noTrendingTopicsFound")} />
          </div>
        ) : (
          topics.map((topic) => (
            <TrendingTopicCard key={topic._id} topic={topic} />
          ))
        )}
      </div>

      {meta.totalPage > 1 && !isLoading && !isError && topics.length > 0 && (
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