"use client"

import { useRef, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { pauseAudio, updateProgress, playAudio } from "@/lib/features/slices/audio/audioSlice"
import { Play, Pause, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import useFavoriteToggle from "@/hooks/useFavoriteToggle"
import useGetFavoriteIds from "@/hooks/useGetFavoriteIds"

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
        return "0:00"
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

const GlobalAudioPlayer = () => {
    const dispatch = useDispatch()
    const { currentAudio, isPlaying, progress } = useSelector((state) => state.audio)
    const audioRef = useRef(null)

    const [favouriteIds] = useGetFavoriteIds();
    const { toggleFavorite } = useFavoriteToggle();
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        toggleFavorite(currentAudio._id);
    };

    // Pause audio on component mount (page reload)
    useEffect(() => {
        dispatch(pauseAudio())
    }, [dispatch])

    // Effect to handle audio source and playback when currentAudio or isPlaying changes
    useEffect(() => {
        if (audioRef.current) {
            if (currentAudio) {
                // Check if a new audio is being set (different URL)
                if (audioRef.current.src !== currentAudio.audio_url) {
                    audioRef.current.src = currentAudio.audio_url
                    audioRef.current.load() // Load only when audio source changes
                }
                audioRef.current.volume = 1 // Ensure volume is set

                if (isPlaying) {
                    audioRef.current.play().catch((e) => console.log("Error playing audio:", e))
                } else {
                    audioRef.current.pause()
                }
            } else {
                // No current audio, so pause and clear source
                audioRef.current.pause()
                audioRef.current.src = ""
            }
        }
    }, [currentAudio, isPlaying])

    // Update progress bar
    const handleTimeUpdate = useCallback(() => {
        if (audioRef.current && audioRef.current.duration) {
            const newProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100
            dispatch(updateProgress(newProgress))
        }
    }, [dispatch])

    // Handle audio ending
    const handleAudioEnded = useCallback(() => {
        dispatch(pauseAudio())
    }, [dispatch])

    // Handle play/pause button click
    const handlePlayPauseClick = () => {
        if (isPlaying) {
            dispatch(pauseAudio())
        } else {
            if (audioRef.current) {
                audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
            }
        }
    }

    // Handle progress bar change
    const handleProgressChange = (value) => {
        if (audioRef.current && audioRef.current.duration) {
            audioRef.current.currentTime = (value[0] / 100) * audioRef.current.duration
            dispatch(updateProgress(value[0]))
        }
    }

    if (!currentAudio) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-2xl">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 animate-pulse" />

                <div className="relative px-3 py-1.5">
                    <div className="flex items-center justify-center max-w-7xl mx-auto">
                        No audio playing
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />

            {/* Subtle animated bars for visual appeal */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-pink-500 opacity-60 animate-pulse">
                <div className="h-full bg-gradient-to-r from-transparent via-green-300 to-transparent animate-pulse" />
            </div>

            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleAudioEnded}
                onLoadedMetadata={handleTimeUpdate}
                onPlay={() => dispatch(playAudio(currentAudio))}
                onPause={() => dispatch(pauseAudio())}
            />

            <div className="relative px-3 py-1.5">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    {/* Left: Audio Info */}
                    <div className="flex items-center gap-3 w-64 min-w-0">
                        <div className="relative h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden shadow-lg ring-2 ring-white/50">
                            <Image
                                src={currentAudio?.cover_image || "/placeholder.svg?height=40&width=40&query=music+cover"}
                                alt={currentAudio?.title || "Audio cover"}
                                fill
                                sizes="40px"
                                className="object-cover"
                            />
                            {/* Subtle overlay for better text contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                            {/* Playing indicator */}
                            {isPlaying && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <div className="flex gap-0.5">
                                        <div className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                                        <div className="w-0.5 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                                        <div className="w-0.5 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-foreground truncate text-sm">{currentAudio?.title}</span>
                            <span className="text-xs text-muted-foreground truncate">{currentAudio?.description || "No description"}</span>
                        </div>
                    </div>

                    {/* Center: Controls */}
                    <div>
                        <Button
                            variant="default"
                            size="icon"
                            onClick={handlePlayPauseClick}
                            className="rounded-full h-10 w-10 bg-gradient-to-r from-primary to-green-300 hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                        </Button>
                    </div>

                    {/* Right: Progress & Actions */}
                    <div className="md:flex items-center gap-3 w-64 justify-end hidden">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-muted-foreground font-mono tabular-nums">
                                {formatTime(audioRef.current?.currentTime || 0)}
                            </span>
                            <div className="flex-1 group">
                                <Slider
                                    value={[progress]}
                                    max={100}
                                    step={0.1}
                                    onValueChange={handleProgressChange}
                                    className="w-[150px] opacity-100 audio-progress-bar"
                                />
                            </div>
                            <span className="text-xs text-muted-foreground font-mono tabular-nums">
                                {formatTime(audioRef.current?.duration || 0)}
                            </span>
                        </div>
                        <Button
                            onClick={handleFavoriteClick}
                            variant="ghost"
                            size="sm"
                            className={`rounded-full h-8 w-8  text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200`}
                        >
                            <Heart className={`h-4 w-4 ${favouriteIds.includes(currentAudio._id) ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GlobalAudioPlayer
