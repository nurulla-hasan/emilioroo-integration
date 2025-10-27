"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Heart, Eye, Star, Clock, Share2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { playAudio, pauseAudio } from '@/lib/features/slices/audio/audioSlice';
import useFavoriteToggle from "@/hooks/useFavoriteToggle";
import { cn, formatDuration } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';


const AudioCard = ({ audio, favouriteIds }) => {
    const dispatch = useDispatch();
    const { currentAudio, isPlaying } = useSelector((state) => state.audio);
    const { toggleFavorite } = useFavoriteToggle();
    const t = useTranslations('MyContentPage');

    const isThisAudioPlaying = currentAudio?._id === audio._id && isPlaying;

    const handlePlayPause = (e) => {
        e.stopPropagation();
        if (isThisAudioPlaying) {
            dispatch(pauseAudio());
        } else {
            dispatch(playAudio(audio));
        }
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        toggleFavorite(audio);
    };

    const handleShare = async (e) => {
        e.stopPropagation();
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
            } else if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
                toast.success(t('linkCopied') || 'Link copied to clipboard');
            } else {
                window.open(url, '_blank');
            }
        } catch {
            toast.error(t('shareFailed') || 'Failed to share');
        }
    };

    return (
        <Card
            id={`audio-${audio._id}`}
            className={cn(
                "group w-full overflow-hidden bg-card flex flex-col border border-gray-200/70 shadow-sm transition-all duration-300",
                "hover:shadow-md hover:-translate-y-[2px]",
            )}
        >
            <CardContent className="p-0 relative">
                {/* Media */}
                <div className="relative h-48 w-full">
                    <Image
                        src={audio.cover_image || "/placeholder.svg?height=320&width=640&query=music+cover"}
                        alt={audio.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-black/10 transition-colors duration-300 group-hover:from-black/50 group-hover:via-black/30 group-hover:to-black/10" />

                    {/* Favorite and Share buttons */}
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                        <TooltipProvider disableHoverableContent>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="bg-black/20 hover:bg-white/25 text-white backdrop-blur-sm"
                                        onClick={handleFavoriteClick}
                                        aria-label="Add to favorites"
                                    >
                                        <Heart className={`w-4 h-4 ${favouriteIds.includes(audio._id) ? "fill-red-500" : ""}`} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="text-xs">
                                    Favorite
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider disableHoverableContent>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="bg-black/20 hover:bg-white/25 text-white backdrop-blur-sm"
                                        onClick={handleShare}
                                        aria-label="Share audio"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="text-xs">
                                    Share
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {/* Duration chip */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDuration(audio.duration)}</span>
                    </div>

                    {/* Play/Pause button */}
                    <TooltipProvider disableHoverableContent>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={handlePlayPause}
                                    className={cn(
                                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                                        "h-16 w-16 rounded-full grid place-items-center text-white",
                                        "transition-all duration-300 backdrop-blur-md",
                                        isThisAudioPlaying
                                            ? "bg-primary shadow-lg shadow-primary/30"
                                            : "bg-white/20 opacity-0 group-hover:opacity-100 hover:bg-white/30",
                                    )}
                                    aria-label={isThisAudioPlaying ? "Pause" : "Play"}
                                >
                                    {/* Pulse when playing */}
                                    {isThisAudioPlaying && <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />}
                                    <span className="relative">
                                        {isThisAudioPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
                                    </span>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                                {isThisAudioPlaying ? "Pause" : "Play"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardContent>

            {/* Content */}
            <CardFooter className="p-5 flex flex-col items-start flex-grow">
                <h3 className="font-semibold text-[15px] md:text-base truncate w-full">{audio.title}</h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {(audio.tags ?? []).map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-full px-2.5 py-1 text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-full border-t border-gray-200/70 my-3" />

                {/* Stats */}
                <div className="w-full flex justify-between items-center text-[13px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" />
                        <span className="tabular-nums">{audio.totalPlay ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4" />
                        <span className="tabular-nums">{audio.totalRating ?? 0}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default AudioCard;
