"use client";

import { useState } from "react";
import { useGetAllAudioQuery } from "@/lib/features/api/chattingApi";
import AudioCard from "@/components/chatting/AudioCard";
import AudioCardSkeleton from "@/components/skeleton/AudioCardSkeleton";
import CustomPagination from "@/components/common/CustomPagination";
import useGetFavoriteIds from "@/hooks/useGetFavoriteIds";

const MostPlayedPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError } = useGetAllAudioQuery({ page, limit });
  const [favouriteIds] = useGetFavoriteIds();

  const audios = data?.data?.result || [];
  const meta = data?.data?.meta || {};

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Most Played Audios</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, index) => (
            <AudioCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 min-h-minus-header">Error loading most played audios.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary dark:text-white">Most Played Audios</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4  gap-6">
        {audios.length > 0 ? (
          audios.map((audio) => (
            <AudioCard key={audio._id} audio={audio} favouriteIds={favouriteIds} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No most played audios found.</p>
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

export default MostPlayedPage;