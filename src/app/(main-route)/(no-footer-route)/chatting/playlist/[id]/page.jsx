"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetSinglePlaylistQuery } from "@/lib/features/api/chattingApi";
import { useDispatch, useSelector } from "react-redux";
import { playAudio, pauseAudio } from "@/lib/features/slices/audio/audioSlice";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Play, Trash2, Edit, Pause } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import UpdatePlaylistModal from "@/components/chatting/playlist/UpdatePlaylistModal";
import { useState } from "react";

const PlaylistDetailPage = () => {
  const params = useParams();
  const playlistId = params.id;
  const dispatch = useDispatch(); // Initialize useDispatch

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Fetch playlist data
  const { data, isLoading, isError } = useGetSinglePlaylistQuery(playlistId);
  const { currentAudio, isPlaying } = useSelector((state) => state.audio); // Access Redux audio state

  // Function to handle playing/pausing an audio
  const handlePlayAudio = (audio) => {
    if (currentAudio?._id === audio._id && isPlaying) {
      dispatch(pauseAudio()); // Pause if already playing this audio
    } else {
      dispatch(playAudio(audio)); // Play this audio
    }
  };

  const playlist = data?.data;

  // Function to format duration from seconds to Hh Mm
  const formatDuration = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "0m";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Calculate total duration of audios in the playlist
  const totalPlaylistDuration = playlist?.audios?.reduce((sum, audio) => sum + (audio.duration || 0), 0);

  if (isLoading) {
    return (
      <div className="p-4">
        {/* Banner Skeleton */}
        <Skeleton className="w-full h-48 rounded-lg mb-6" />

        {/* Header Info Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-4" />

          {/* Creator Info Skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>

        {/* Audio List Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center bg-card rounded-lg shadow-sm p-4">
              <Skeleton className="w-24 h-24 rounded-md flex-shrink-0 mr-4" />
              <div className="flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="w-20 h-10 rounded-md ml-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 p-4">Error loading playlist details.</div>;
  }

  if (!playlist) {
    return <div className="text-center text-gray-500 p-4">Playlist not found.</div>;
  }

  return (
    <div className="px-4 lg:px-0">
      {/* Banner Image */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
        <Image
          src={playlist.cover_image || "/placeholder.png"}
          alt={playlist.name || "Playlist Banner"}
          fill
          className="object-cover"
        />
      </div>

      {/* Playlist Header Info */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
        <p className="text-gray-600 text-sm mb-4">
          {playlist.audios?.length || 0}+ audio | {formatDuration(totalPlaylistDuration)}
        </p>
        <p className="text-gray-500 text-xs mb-4">Last Updated: {new Date(playlist.updatedAt).toLocaleDateString()}</p>

        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="w-10 h-10">
            <AvatarImage src={playlist.user?.profile_image || "/placeholder.png"} alt={playlist.user?.name || "Creator"} />
            <AvatarFallback>{playlist.user?.name ? playlist.user.name.charAt(0) : "CN"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{playlist.user?.name}</p>
            <p className="text-sm text-gray-500">creator</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4 mr-2" /> Delete Playlist
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Edit className="w-4 h-4 mr-2" /> Edit Playlist
          </Button>
        </div>
      </div>

      {/* Playlist Description */}
      {playlist.description && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{playlist.description}</p>
        </div>
      )}

      {/* Audio List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Audios in this Playlist</h2>
        {playlist.audios && playlist.audios.length > 0 ? (
          playlist.audios.map((audio) => (
            <div key={audio._id} className="flex items-center bg-card border rounded-lg p-4">
              <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 mr-4">
                <Image
                  src={audio.cover_image || "/placeholder.png"}
                  alt={audio.title || "Audio Cover"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate mb-1">{audio.title}</h3>
                <p className="text-sm text-gray-600 truncate mb-2">{audio.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {audio.tags && audio.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 ml-4">
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
                <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">Delete</Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No audios in this playlist.</p>
        )}
      </div>
      
      {playlist && <UpdatePlaylistModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} playlist={playlist} />}
    </div>
  );
};

export default PlaylistDetailPage;