"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { pauseAudio, playAudio, updateProgress } from "@/lib/features/slices/audio/audioSlice"
import { Play, Pause, Heart, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import useFavoriteToggle from "@/hooks/useFavoriteToggle"
import useGetFavoriteIds from "@/hooks/useGetFavoriteIds"

const GlobalAudioPlayer = () => {
    const dispatch = useDispatch()
    const { currentAudio, isPlaying, progress } = useSelector((state) => state.audio)
    const audioRef = useRef(null)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)

    const [favouriteIds] = useGetFavoriteIds();
    const { toggleFavorite } = useFavoriteToggle();
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        toggleFavorite(currentAudio._id);
    };

    useEffect(() => {
        dispatch(pauseAudio())
    }, [dispatch])

    useEffect(() => {
        if (audioRef.current) {
            if (currentAudio) {
                if (audioRef.current.src !== currentAudio.audio_url) {
                    audioRef.current.src = currentAudio.audio_url
                    audioRef.current.load()
                }
                audioRef.current.volume = isMuted ? 0 : volume

                if (isPlaying) {
                    audioRef.current.play().catch((e) => console.log("Error playing audio:", e))
                } else {
                    audioRef.current.pause()
                }
            } else {
                audioRef.current.pause()
                audioRef.current.src = ""
            }
        }
    }, [currentAudio, isPlaying, volume, isMuted])

    const handleTimeUpdate = useCallback(() => {
        if (audioRef.current && audioRef.current.duration) {
            const newProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100
            dispatch(updateProgress(newProgress))
        }
    }, [dispatch])

    const handleAudioEnded = useCallback(() => {
        dispatch(pauseAudio())
    }, [dispatch])

    const handlePlayPauseClick = () => {
        if (isPlaying) {
            dispatch(pauseAudio())
        } else {
            if (audioRef.current) {
                audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
            }
        }
    }

    const handleProgressChange = (value) => {
        if (audioRef.current && audioRef.current.duration) {
            audioRef.current.currentTime = (value[0] / 100) * audioRef.current.duration
            dispatch(updateProgress(value[0]))
        }
    }

    const handleVolumeChange = (value) => {
        setVolume(value[0])
        setIsMuted(false)
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
    }

    if (!currentAudio) {
        return null
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/60 shadow-2xl animate-slide-up">
            <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={handleProgressChange}
                className="w-full h-1 rounded-none [&>span:first-child]:rounded-none [&>span:first-child]:h-1 [&>span:first-child]:bg-primary"
            />

            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleAudioEnded}
                onLoadedMetadata={handleTimeUpdate}
                onPlay={() => dispatch(playAudio(currentAudio))}
                onPause={() => dispatch(pauseAudio())}
            />

            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Left: Audio Info */}
                    <div className="flex items-center gap-4 w-1/3 min-w-0">
                        <div className="relative h-14 w-14 flex-shrink-0 rounded-md overflow-hidden shadow-lg">
                            <Image
                                src={currentAudio?.cover_image || "/placeholder.svg"}
                                alt={currentAudio?.title || "Audio cover"}
                                fill
                                sizes="56px"
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{currentAudio?.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{currentAudio?.description || "No description"}</p>
                        </div>
                    </div>

                    {/* Center: Controls */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                            <Shuffle className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <SkipBack className="h-5 w-5" />
                        </Button> */}
                        <Button
                            variant="default"
                            size="icon"
                            onClick={handlePlayPauseClick}
                            className="rounded-full h-12 w-12 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform duration-200 hover:scale-105"
                        >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                        </Button>
                        {/* <Button variant="ghost" size="icon">
                            <SkipForward className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                            <Repeat className="h-5 w-5" />
                        </Button> */}
                    </div>

                    {/* Right: Volume & Actions */}
                    <div className="flex items-center gap-4 w-1/3 justify-end">
                        <div className="flex items-center gap-2 w-full max-w-[120px]">
                            <Button onClick={toggleMute} variant="ghost" size="icon">
                                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                            <Slider
                                value={[isMuted ? 0 : volume]}
                                max={1}
                                step={0.01}
                                onValueChange={handleVolumeChange}
                            />
                        </div>
                        <Button
                            onClick={handleFavoriteClick}
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <Heart className={`h-5 w-5 ${favouriteIds.includes(currentAudio._id) ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GlobalAudioPlayer