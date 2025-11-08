"use client";

import { useState } from "react";
import {
  useGetAllPlaylistQuery,
  useGetMyPlaylistQuery,
} from "@/lib/features/api/chattingApi";
import PlaylistCard from "@/components/chatting/playlist/PlaylistCard";
import PlaylistCardSkeleton from "@/components/skeleton/PlaylistCardSkeleton";
import CustomPagination from "@/components/common/CustomPagination";
import LoadFailed from "@/components/common/LoadFailed";
import NoData from "@/components/common/NoData";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import CreatePlaylistModal from "@/components/chatting/playlist/CreatePlaylistModal";
import { useTranslations } from "next-intl";
import Title from "@/components/ui/Title";

const PlaylistPage = () => {
  const t = useTranslations("PlaylistPage");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [allPage, setAllPage] = useState(1);
  const [myPage, setMyPage] = useState(1);
  const limit = 12;

  const {
    data: allPlaylistsData,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
  } = useGetAllPlaylistQuery({ page: allPage, limit });

  const {
    data: myPlaylistsData,
    isLoading: isLoadingMy,
    isError: isErrorMy,
    error: errorMy,
  } = useGetMyPlaylistQuery({ page: myPage, limit });

  const allPlaylists = allPlaylistsData?.data?.result || [];
  const allMeta = allPlaylistsData?.data?.meta || {};

  const myPlaylists = myPlaylistsData?.data?.result || [];
  const myMeta = myPlaylistsData?.data?.meta || {};

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title>
          {t("myPlaylists")}
        </Title>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus />
          {t("createNewPlaylist")}
        </Button>
      </div>

      <Tabs defaultValue="all-playlists" className="w-full">
        <TabsList className="inline-flex mr-auto">
          <TabsTrigger value="all-playlists">{t("allPlaylists")}</TabsTrigger>
          <TabsTrigger value="my-playlists">{t("myPlaylists")}</TabsTrigger>
        </TabsList>

        {/* All Playlists Tab */}
        <TabsContent value="all-playlists">
          {isLoadingAll ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {Array.from({ length: limit }).map((_, i) => (
                <PlaylistCardSkeleton key={i} />
              ))}
            </div>
          ) : isErrorAll ? (
            <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
              <LoadFailed msg={errorAll?.message || t("errorLoadingPlaylists")} />
            </div>
          ) : allPlaylists.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {allPlaylists.map((playlist) => (
                  <PlaylistCard key={playlist._id} playlist={playlist} />
                ))}
              </div>
              {allMeta.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <CustomPagination
                    currentPage={allMeta.page}
                    totalPages={allMeta.totalPages}
                    onPageChange={setAllPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
              <NoData msg={t("noPlaylistsFound")} />
            </div>
          )}
        </TabsContent>

        {/* My Playlists Tab */}
        <TabsContent value="my-playlists">
          {isLoadingMy ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {Array.from({ length: limit }).map((_, i) => (
                <PlaylistCardSkeleton key={i} />
              ))}
            </div>
          ) : isErrorMy ? (
            <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
              <LoadFailed msg={errorMy?.message || t("errorLoadingYourPlaylists")} />
            </div>
          ) : myPlaylists.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {myPlaylists.map((playlist) => (
                  <PlaylistCard key={playlist._id} playlist={playlist} />
                ))}
              </div>
              {myMeta.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <CustomPagination
                    currentPage={myMeta.page}
                    totalPages={myMeta.totalPages}
                    onPageChange={setMyPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full mx-auto flex items-center justify-center md:h-[60vh]">
              <NoData msg={t("noPlaylistsFound")} />
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreatePlaylistModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default PlaylistPage;