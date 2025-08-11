"use client";

import { useState } from "react";
import { useGetAllTopicsQuery } from "@/lib/features/api/chattingApi";
import TrendingTopicCard from "@/components/chatting/trending/TrendingTopicCard";
import CustomPagination from "@/components/common/CustomPagination";
import CardSkeleton from "@/components/common/CardSkeleton";

const TrendingPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError } = useGetAllTopicsQuery({ page, limit });

  const topics = data?.data?.result || [];
  const meta = data?.data?.meta || {};

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(limit)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 p-4">Error loading trending topics.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Trending Topics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <TrendingTopicCard key={topic._id} topic={topic} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No trending topics found.</p>
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

export default TrendingPage;
