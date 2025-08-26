"use client";

import { useState } from "react";
import { useGetAllAudioQuery } from "@/lib/features/api/chattingApi";
import AudioCard from "@/components/chatting/AudioCard";
import AudioCardSkeleton from "@/components/skeleton/AudioCardSkeleton";
import CustomPagination from "@/components/common/CustomPagination";
import LoadFailed from "@/components/common/LoadFailed";
import NoData from "@/components/common/NoData";
import useGetFavoriteIds from "@/hooks/useGetFavoriteIds";
import { useTranslations } from "next-intl";
import Title from "@/components/ui/Title";

const MostPlayedPage = () => {
  const t = useTranslations("MostPlayedPage");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, error } = useGetAllAudioQuery({ page, limit });
  const [favouriteIds] = useGetFavoriteIds();

  const audios = data?.data?.result || [];
  const meta = data?.data?.meta || {};

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title>
          {t("mostPlayedAudios")}
        </Title>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <AudioCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
          <LoadFailed msg={error?.message || t("errorLoadingMostPlayed")} />
        </div>
      ) : audios.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {audios.map((audio) => (
              <AudioCard key={audio._id} audio={audio} favouriteIds={favouriteIds} />
            ))}
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
        </>
      ) : (
        <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
          <NoData msg={t("noMostPlayedAudios")} />
        </div>
      )}
    </div>
  );
};

export default MostPlayedPage;