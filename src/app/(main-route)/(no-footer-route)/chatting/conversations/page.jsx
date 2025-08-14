"use client";

import { useState } from "react";
import { useGetAllAudioQuery } from "@/lib/features/api/chattingApi";
import CustomPagination from "@/components/common/CustomPagination"; 
import { useDispatch, useSelector } from "react-redux";
import { playAudio, pauseAudio } from "@/lib/features/slices/audio/audioSlice";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Play, Pause } from "lucide-react";
import ConversationAudioCardSkeleton from "@/components/skeleton/ConversationAudioCardSkeleton";
import { formatDuration } from "@/lib/utils";

const ConversationsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const dispatch = useDispatch();
  const { currentAudio, isPlaying } = useSelector((state) => state.audio);

  const { data, isLoading, isError } = useGetAllAudioQuery({ page, limit });

  const audios = data?.data?.result || [];
  const meta = data?.data?.meta || {};

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePlayAudio = (audio) => {
    if (currentAudio?._id === audio._id && isPlaying) {
      dispatch(pauseAudio());
    } else {
      dispatch(playAudio(audio));
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Conversations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(limit)].map((_, index) => (
            <ConversationAudioCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 min-h-minus-header">Error loading conversations.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary dark:text-white">Conversations</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {audios.length > 0 ? (
          audios.map((audio) => (
            <div key={audio._id} className="flex flex-col sm:flex-row sm:items-center bg-gray-50 dark:bg-card border rounded-lg p-4">
              <div className="relative w-full h-48 sm:w-24 sm:h-24 rounded-md overflow-hidden flex-shrink-0 sm:mr-4 mb-4 sm:mb-0">
                <Image
                  src={audio.cover_image || "/placeholder.png"}
                  alt={audio.title || "Audio Cover"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 200px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end w-full">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{audio.title}</h3>
                  <p className="text-sm text-gray-600 text-wrap mb-2">{audio.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                    {audio.tags && audio.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0 sm:ml-4">
                  <Button size="icon" variant="ghost" className="rounded-full" onClick={() => handlePlayAudio(audio)}>
                    {currentAudio?._id === audio._id && isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye className="w-4 h-4 mr-1" /> {audio.totalPlay || 0}k
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-1" /> {audio.totalRating || 0}
                  </div>
                  <div className="text-sm text-gray-600">{formatDuration(audio.duration)}</div>
                  {/* Delete button is not in the provided snippet, so omitting */}
                  {/* <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">Delete</Button> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No conversations found.</p>
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