"use client";

import { useState } from "react";
import { useGetAllPlaylistQuery, useGetMyPlaylistQuery } from "@/lib/features/api/chattingApi"; // Import useGetMyPlaylistQuery
import PlaylistCard from "@/components/chatting/playlist/PlaylistCard";
import PlaylistCardSkeleton from "@/components/chatting/playlist/PlaylistCardSkeleton";
import CustomPagination from "@/components/common/CustomPagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

const PlaylistPage = () => {
  // State for All Playlists
  const [allPage, setAllPage] = useState(1);
  const [allLimit] = useState(10);

  // State for My Playlists
  const [myPage, setMyPage] = useState(1);
  const [myLimit] = useState(10);

  // Fetch data for All Playlists
  const { data: allPlaylistsData, isLoading: isLoadingAll, isError: isErrorAll } = useGetAllPlaylistQuery({ page: allPage, limit: allLimit });

  // Fetch data for My Playlists
  const { data: myPlaylistsData, isLoading: isLoadingMy, isError: isErrorMy } = useGetMyPlaylistQuery({ page: myPage, limit: myLimit });

  const allPlaylists = allPlaylistsData?.data?.result || [];
  const allMeta = allPlaylistsData?.data?.meta || {};

  const myPlaylists = myPlaylistsData?.data?.result || [];
  const myMeta = myPlaylistsData?.data?.meta || {};

  const handleAllPageChange = (newPage) => {
    setAllPage(newPage);
  };

  const handleMyPageChange = (newPage) => {
    setMyPage(newPage);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Playlists</h1>
        <Button className="bg-primary dark:text-white"><Plus className="w-4 h-4" /> Create new playlist</Button>
      </div>

      <Tabs defaultValue="all-playlists" className="w-full">
        <TabsList className="inline-flex ml-auto">
          <TabsTrigger value="all-playlists">All Playlists</TabsTrigger>
          <TabsTrigger value="my-playlists">My Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="all-playlists">
          {isLoadingAll ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
              {[...Array(allLimit)].map((_, index) => (
                <PlaylistCardSkeleton key={index} />
              ))}
            </div>
          ) : isErrorAll ? (
            <div className="text-center text-red-500 p-4">Error loading playlists.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
                {allPlaylists.length > 0 ? (
                  allPlaylists.map((playlist) => (
                    <PlaylistCard key={playlist._id} playlist={playlist} />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">No playlists found.</p>
                )}
              </div>
              {allMeta.totalPage > 1 && (
                <div className="mt-8 flex justify-center">
                  <CustomPagination
                    currentPage={allMeta.page}
                    totalPage={allMeta.totalPage}
                    onPageChange={handleAllPageChange}
                  />
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="my-playlists">
          {isLoadingMy ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
              {[...Array(myLimit)].map((_, index) => (
                <PlaylistCardSkeleton key={index} />
              ))}
            </div>
          ) : isErrorMy ? (
            <div className="text-center text-red-500 p-4">Error loading your playlists.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {myPlaylists.length > 0 ? (
                  myPlaylists.map((playlist) => (
                    <PlaylistCard key={playlist._id} playlist={playlist} />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">No playlists found.</p>
                )}
              </div>
              {myMeta.totalPage > 1 && (
                <div className="mt-8 flex justify-center">
                  <CustomPagination
                    currentPage={myMeta.page}
                    totalPage={myMeta.totalPage}
                    onPageChange={handleMyPageChange}
                  />
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlaylistPage;