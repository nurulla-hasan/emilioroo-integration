"use client";

import { useState } from "react";
import { useGetMyAudioQuery, useDeleteAudioMutation } from "@/lib/features/api/chattingApi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Edit, Trash2, Share2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { playAudio, pauseAudio } from "@/lib/features/slices/audio/audioSlice";
import ConversationAudioCardSkeleton from "@/components/skeleton/ConversationAudioCardSkeleton";
import UpdateAudioModal from "@/components/chatting/my-content/UpdateAudioModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import Title from "@/components/ui/Title";
import NoData from "@/components/common/NoData";
import LoadFailed from "@/components/common/LoadFailed";

const MyContentPage = () => {
  const t = useTranslations('MyContentPage');
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetMyAudioQuery();
  const [deleteAudio, { isLoading: isDeleting }] = useDeleteAudioMutation();
  const { currentAudio, isPlaying } = useSelector((state) => state.audio);

  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const myAudios = data?.data?.result || [];

  const handlePlayAudio = (audio) => {
    if (currentAudio?._id === audio._id && isPlaying) {
      dispatch(pauseAudio());
    } else {
      dispatch(playAudio(audio));
    }
  };

  const handleEditClick = (audio) => {
    setSelectedAudio(audio);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (audio) => {
    setSelectedAudio(audio);
    setIsConfirmModalOpen(true);
  };

  const handleShare = async (audio) => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      const url = `${origin}${path}#audio-${audio._id}`;

      if (navigator.share) {
        await navigator.share({
          title: audio?.title || 'Audio',
          text: audio?.description || '',
          url,
        });
        // toast.success(t('sharedSuccessfully') || 'Shared');
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success(t('linkCopied') || 'Link copied to clipboard');
      } else {
        // Fallback: open url in new tab
        window.open(url, '_blank');
      }
    } catch {
      toast.error(t('shareFailed') || 'Failed to share');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAudio) return;
    try {
      await deleteAudio(selectedAudio._id).unwrap();
      toast.success(t("audioDeletedSuccessfully"));
      setIsConfirmModalOpen(false);
      setSelectedAudio(null);
    } catch  {
      toast.error(t("failedToDeleteAudio"));
      // console.log(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title>{t('myContent')}</Title>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {
          isLoading ? (
            [...Array(10)].map((_, index) => (
              <ConversationAudioCardSkeleton key={index} />
            ))
          ) : isError ? (
            <div className="col-span-full mx-auto">
              <LoadFailed msg={t('errorLoadingContent')} />
            </div>
          ) : myAudios.length > 0 ? (
            myAudios.map((audio) => (
              <div id={`audio-${audio._id}`} key={audio._id} className="flex flex-col sm:flex-row sm:items-center bg-gray-50 dark:bg-card border rounded-lg p-4">
                <div className="relative w-full h-48 sm:w-24 sm:h-24 rounded-md overflow-hidden flex-shrink-0 sm:mr-4 mb-4 sm:mb-0">
                  <Image
                    src={audio.cover_image || "/placeholder.png"}
                    alt={audio.title || "Audio Cover"}
                    fill
                    sizes="(max-width: 640px) 100vw, 200px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end w-full">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{audio.title}</h3>
                    <p className="text-sm text-gray-600 text-wrap mb-2">{audio.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                      {audio.tags?.map((tag, idx) => (
                        <Badge key={idx} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4">
                    <Button size="icon" variant="ghost" className="rounded-full" onClick={() => handlePlayAudio(audio)}>
                      {currentAudio?._id === audio._id && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleShare(audio)}>
                      <Share2 className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleEditClick(audio)}>
                      <Edit className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteClick(audio)}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full mx-auto">
              <NoData msg={t('noContentCreated')} />
            </div>
          )
        }
      </div>

      {selectedAudio && (
        <UpdateAudioModal
          isOpen={isUpdateModalOpen}
          onOpenChange={setIsUpdateModalOpen}
          audio={selectedAudio}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        title={t('areYouSure')}
        description={t('deleteConfirmation')}
        onConfirm={handleDeleteConfirm}
        confirmText={t('delete')}
        loading={isDeleting}
      />
    </div>
  );
};

export default MyContentPage;