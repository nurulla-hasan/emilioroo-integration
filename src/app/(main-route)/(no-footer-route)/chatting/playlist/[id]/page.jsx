"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetSinglePlaylistQuery, useDeletePlaylistMutation } from "@/lib/features/api/chattingApi";
import { useDispatch, useSelector } from "react-redux";
import { playAudio, pauseAudio } from "@/lib/features/slices/audio/audioSlice";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Play, Trash2, Edit, Pause, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UpdatePlaylistModal from "@/components/chatting/playlist/UpdatePlaylistModal";
import { useState } from "react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { toast } from "sonner";
import SinglePlaylistSkeleton from "@/components/skeleton/SinglePlaylistSkeleton";

const PlaylistDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id;
  const dispatch = useDispatch();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { data, isLoading, isError } = useGetSinglePlaylistQuery(playlistId);
  const [deletePlaylist, { isLoading: isDeleting }] = useDeletePlaylistMutation();
  const { currentAudio, isPlaying } = useSelector((state) => state.audio);

  const handlePlayAudio = (audio) => {
    if (currentAudio?._id === audio._id && isPlaying) {
      dispatch(pauseAudio());
    } else {
      dispatch(playAudio(audio));
    }
  };

  const handleDelete = async () => {
    try {
      await deletePlaylist(playlistId).unwrap();
      toast.success("Playlist deleted successfully");
      setIsConfirmModalOpen(false);
      router.push("/chatting/playlist");
    } catch (error) {
      toast.error("Failed to delete playlist");
      console.log(error);
    }
  };

  const playlist = data?.data;

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

  const totalPlaylistDuration = playlist?.audios?.reduce((sum, audio) => sum + (audio.duration || 0), 0);

  if (isLoading) {
    return (
      <SinglePlaylistSkeleton />
    );
  }

  if (isError) {
    return <div className="text-center text-red-500">Error loading playlist details.</div>;
  }

  if (!playlist) {
    return <div className="text-center text-gray-500">Playlist not found.</div>;
  }

  return (
    <div>
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
          <Button onClick={() => setIsConfirmModalOpen(true)} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4 mr-2" /> Delete Playlist
          </Button>
          <Button onClick={() => setIsUpdateModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
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

      {/* Update Playlist Modal */}
      {playlist && <UpdatePlaylistModal isOpen={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen} playlist={playlist} />}
      {/* Delete Playlist Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        title="Are you sure you want to delete this playlist?"
        description="This action cannot be undone. This will permanently delete the playlist."
        onConfirm={handleDelete}
        confirmText={isDeleting ? <><Loader2 className="animate-spin" /> Deleting</> : "Delete"}
      />
    </div>
  );
};

export default PlaylistDetailPage;
