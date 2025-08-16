"use client";

import { useState } from "react";
import { useGetMyAudioQuery, useDeleteAudioMutation } from "@/lib/features/api/chattingApi"; 
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Edit, Trash2, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { playAudio, pauseAudio } from "@/lib/features/slices/audio/audioSlice";
import ConversationAudioCardSkeleton from "@/components/skeleton/ConversationAudioCardSkeleton";
import UpdateAudioModal from "@/components/chatting/my-content/UpdateAudioModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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

  const handleDeleteConfirm = async () => {
    if (!selectedAudio) return;
    try {
      await deleteAudio(selectedAudio._id).unwrap();
      toast.success(t("audioDeletedSuccessfully"));
      setIsConfirmModalOpen(false);
      setSelectedAudio(null);
    } catch (error) {
      toast.error(t("failedToDeleteAudio"));
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">{t('myContent')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(10)].map((_, index) => <ConversationAudioCardSkeleton key={index} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500">{t('errorLoadingContent')}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary dark:text-white">{t('myContent')}</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {myAudios.length > 0 ? (
          myAudios.map((audio) => (
            <div key={audio._id} className="flex flex-col sm:flex-row sm:items-center bg-gray-50 dark:bg-card border rounded-lg p-4">
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
                    {audio.tags?.map((tag, idx) => <Badge key={idx} variant="outline">{tag}</Badge>)}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4">
                  <Button size="icon" variant="ghost" className="rounded-full" onClick={() => handlePlayAudio(audio)}>
                    {currentAudio?._id === audio._id && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleEditClick(audio)}><Edit className="w-5 h-5" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteClick(audio)}><Trash2 className="w-5 h-5" /></Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">{t('noContentCreated')}</p>
        )}
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
        confirmText={isDeleting ? <><Loader2 className="animate-spin" />{t('deleting')}</> : t('delete')}
      />
    </div>
  );
};

export default MyContentPage;