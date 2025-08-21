"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetSinglePlaylistQuery, useDeletePlaylistMutation } from "@/lib/features/api/chattingApi";
import { Trash2, Edit } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UpdatePlaylistModal from "@/components/chatting/playlist/UpdatePlaylistModal";
import { useState } from "react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { toast } from "sonner";
import SinglePlaylistSkeleton from "@/components/skeleton/SinglePlaylistSkeleton";
import TrendingAudioCard from "@/components/chatting/trending/TrendingAudioCard";
import { useTranslations } from 'next-intl';
import { fallbackAvatar, getInitials } from "@/lib/utils";

const PlaylistDetailPage = () => {
  const t = useTranslations('PlaylistDetailPage');
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id;

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { data, isLoading, isError } = useGetSinglePlaylistQuery(playlistId);
  const [deletePlaylist, { isLoading: isDeleting }] = useDeletePlaylistMutation();


  const handleDelete = async () => {
    try {
      await deletePlaylist(playlistId).unwrap();
      toast.success(t("playlistDeletedSuccessfully"));
      setIsConfirmModalOpen(false);
      router.push("/chatting/playlist");
    } catch (error) {
      toast.error(t("failedToDeletePlaylist"));
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
    return <div className="text-center text-red-500">{t('errorLoadingPlaylist')}</div>;
  }

  if (!playlist) {
    return <div className="text-center text-muted-foreground">{t('playlistNotFound')}</div>;
  }

  return (
    <div>
      {/* Banner Image */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
        <Image
          src={playlist.cover_image || fallbackAvatar}
          alt={playlist.name || "Playlist Banner"}
          fill
          className="object-cover"
        />
      </div>

      {/* Playlist Header Info */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
        <p className="text-muted-foreground text-sm mb-4">
          {playlist.audios?.length || 0}+ {t('audio')} | {formatDuration(totalPlaylistDuration)}
        </p>
        <p className="text-muted-foreground text-xs mb-4">{t('lastUpdated')}: {new Date(playlist.updatedAt).toLocaleDateString()}</p>

        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="w-10 h-10">
            <AvatarImage src={playlist.user?.profile_image || fallbackAvatar} alt={playlist.user?.name || "Creator"} />
            <AvatarFallback>{playlist.user?.name ? getInitials(playlist.user.name) : "CN"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{playlist.user?.name}</p>
            <p className="text-sm text-muted-foreground">{t('creator')}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={() => setIsConfirmModalOpen(true)} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4 mr-2" /> {t('deletePlaylist')}
          </Button>
          <Button onClick={() => setIsUpdateModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Edit className="w-4 h-4 mr-2" /> {t('editPlaylist')}
          </Button>
        </div>
      </div>

      {/* Playlist Description */}
      {playlist.description && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t('description')}</h2>
          <p className="text-muted-foreground">{playlist.description}</p>
        </div>
      )}

      {/* Audio List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">{t('audiosInPlaylist')}</h2> 
        {playlist.audios && playlist.audios.length > 0 ? (
          playlist.audios.map((audio) => (
            <TrendingAudioCard key={audio._id} audio={audio} />
          ))
        ) : (
          <p className="text-center text-muted-foreground">{t('noAudiosInPlaylist')}</p>
        )}
      </div>

      {/* Update Playlist Modal */}
      {playlist && <UpdatePlaylistModal isOpen={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen} playlist={playlist} />}
      {/* Delete Playlist Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        title={t('areYouSureDeletePlaylist')}
        description={t('deletePlaylistConfirmation')}
        onConfirm={handleDelete}
        confirmText={t('delete')}
        loading={isDeleting}
      />
    </div>
  );
};

export default PlaylistDetailPage;