"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pauseAudio, updateProgress, clearAudio, playAudio } from '@/lib/features/slices/audio/audioSlice';
import { Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
        return "0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const GlobalAudioPlayer = () => {
    const dispatch = useDispatch();
    const { currentAudio, isPlaying, progress } = useSelector((state) => state.audio);
    const audioRef = useRef(null);

    // Pause audio on component mount (page reload)
    useEffect(() => {
        dispatch(pauseAudio());
    }, [dispatch]);

    // Effect to handle audio source and playback when currentAudio or isPlaying changes
    useEffect(() => {
        if (audioRef.current) {
            if (currentAudio) {
                // Check if a new audio is being set (different URL)
                if (audioRef.current.src !== currentAudio.audio_url) {
                    audioRef.current.src = currentAudio.audio_url;
                    audioRef.current.load(); // Load only when audio source changes
                }
                audioRef.current.volume = 1; // Ensure volume is set

                if (isPlaying) {
                    audioRef.current.play().catch(e => console.log("Error playing audio:", e));
                } else {
                    audioRef.current.pause();
                }
            } else {
                // No current audio, so pause and clear source
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        }
    }, [currentAudio, isPlaying]); 

    // Update progress bar
    const handleTimeUpdate = useCallback(() => {
        if (audioRef.current && audioRef.current.duration) {
            const newProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            dispatch(updateProgress(newProgress));
        }
    }, [dispatch]);

    // Handle audio ending
    const handleAudioEnded = useCallback(() => {
        dispatch(pauseAudio());
        dispatch(clearAudio());
    }, [dispatch]);

    // Handle play/pause button click
    const handlePlayPauseClick = () => {
        if (isPlaying) {
            dispatch(pauseAudio());
        } else {
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.error("Error playing audio:", e));
            }
        }
    };

    // Handle progress bar change
    const handleProgressChange = (value) => {
        if (audioRef.current && audioRef.current.duration) {
            audioRef.current.currentTime = (value[0] / 100) * audioRef.current.duration;
            dispatch(updateProgress(value[0]));
        }
    };

    // Handle close button
    const handleClose = () => {
        dispatch(clearAudio());
    };

    if (!currentAudio) {
        return null; 
    }

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-xl w-[calc(100%-2rem)] bg-white/10 backdrop-blur-sm border p-2 rounded-full flex items-center justify-between z-50">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleAudioEnded}
                onLoadedMetadata={handleTimeUpdate} 
                onPlay={() => dispatch(playAudio(currentAudio))}
                onPause={() => dispatch(pauseAudio())}
            />

            {/* Audio Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden">
                    <Image
                        src={currentAudio?.cover_image || "/placeholder.png"}
                        alt={currentAudio?.title || "Audio cover"}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col truncate">
                    <span className="font-semibold text-sm truncate">{currentAudio?.title}</span>
                    <span className="text-xs text-muted-foreground truncate">{currentAudio?.description || "No description"}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-1 justify-center">
                <Button variant="ghost" size="icon" onClick={handlePlayPauseClick} className="h-10 w-10 rounded-full">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <div className="flex items-center gap-2 w-full max-w-xs">
                    <span className="text-xs text-muted-foreground">{formatTime(audioRef.current?.currentTime || 0)}</span>
                    <Slider
                        value={[progress]}
                        max={100}
                        step={0.1}
                        onValueChange={handleProgressChange}
                        className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">{formatTime(audioRef.current?.duration || 0)}</span>
                </div>
            </div>

            {/* Close Button */}
            <div className="flex items-center justify-end">
                <Button variant="ghost" size="icon" onClick={handleClose} className="h-10 w-10 rounded-full">
                    <X className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

export default GlobalAudioPlayer;
