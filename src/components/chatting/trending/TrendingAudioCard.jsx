"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Play, Pause, Heart, Share2 } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { playAudio, pauseAudio } from "@/lib/features/slices/audio/audioSlice";
import useFavoriteToggle from "@/hooks/useFavoriteToggle";
import useGetFavoriteIds from "@/hooks/useGetFavoriteIds";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const TrendingAudioCard = ({ audio }) => {
  const [favouriteIds] = useGetFavoriteIds();
  const dispatch = useDispatch();
  const { currentAudio, isPlaying } = useSelector((state) => state.audio);
  const t = useTranslations('MyContentPage');

  const { toggleFavorite } = useFavoriteToggle();

  const handlePlayAudio = (audio) => {
    if (currentAudio?._id === audio._id && isPlaying) {
      dispatch(pauseAudio());
    } else {
      dispatch(playAudio(audio));
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(audio);
  };

  const handleShare = async () => {
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
        // Optional toast removed to match MyContent behavior
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        // toast.success(t('linkCopied') || 'Link copied to clipboard');
      } else {
        window.open(url, '_blank');
      }
    } catch {
      toast.error(t('shareFailed') || 'Failed to share');
    }
  };

  return (
    <div id={`audio-${audio._id}`} key={audio._id} className="flex flex-col sm:flex-row sm:items-center bg-gray-50 dark:bg-card border rounded-lg p-4">
      <div className="relative w-full h-48 sm:w-24 sm:h-24 rounded-md overflow-hidden flex-shrink-0 sm:mr-4 mb-4 sm:mb-0">
        <Image
          src={audio.cover_image || "/placeholder.png"}
          alt={audio.title || "Audio Cover"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 200px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end w-full">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{audio.title}</h3>
          <p className="text-sm text-muted-foreground text-wrap mb-2">{audio.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            {audio.tags && audio.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-4">
          <div>
            <Button size="icon" variant="ghost" className="rounded-full" onClick={handleFavoriteClick}>
              <Heart className={`w-5 h-5 ${favouriteIds.includes(audio._id) ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0 sm:ml-4">
            <Button size="icon" variant="ghost" className="rounded-full" onClick={() => handlePlayAudio(audio)}>
              {currentAudio?._id === audio._id && isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>
            <Button size="icon" variant="ghost" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
            <div className="flex items-center text-sm text-muted-foreground">
              <Eye className="w-4 h-4 mr-1" /> {audio.totalPlay || 0}k
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="w-4 h-4 mr-1" /> {audio.totalRating || 0}
            </div>
            <div className="text-sm text-muted-foreground">{formatDuration(audio.duration)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingAudioCard;
