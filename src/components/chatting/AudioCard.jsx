"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Heart, Eye, Star, Clock } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { playAudio, pauseAudio } from '@/lib/features/slices/audio/audioSlice';

const formatDuration = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AudioCard = ({ audio }) => {
    const dispatch = useDispatch();
    const { currentAudio, isPlaying } = useSelector((state) => state.audio);

    const isThisAudioPlaying = currentAudio?._id === audio._id && isPlaying;

    const handlePlayPause = (e) => {
        e.stopPropagation();
        if (isThisAudioPlaying) {
            dispatch(pauseAudio());
        } else {
            dispatch(playAudio(audio));
        }
    };

    return (
        <Card className="w-full overflow-hidden bg-card flex flex-col group">
            <CardContent className="p-0 relative">
                <div className="relative h-48 w-full">
                    <Image
                        src={audio.cover_image || "/placeholder.png"}
                        alt={audio.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    <Button
                        size="icon"
                        className="absolute top-2 right-2 bg-transparent hover:bg-white/20 text-white"
                        onClick={(e) => e.stopPropagation()} // Placeholder for favorite action
                    >
                        <Heart className="h-5 w-5" />
                    </Button>
                    <Button
                        size="lg"
                        variant="ghost"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/20 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={handlePlayPause}
                    >
                        {isThisAudioPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="p-4 flex flex-col items-start flex-grow">
                <h3 className="font-semibold text-base truncate w-full">{audio.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {audio.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="w-full border-t my-3"></div>
                <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{audio.totalPlay || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{audio.totalRating || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(audio.duration)}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default AudioCard;
