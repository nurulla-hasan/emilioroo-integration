"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import useFavoriteToggle from "@/hooks/useFavoriteToggle"
import useGetFavoriteIds from "@/hooks/useGetFavoriteIds"
import { getAudio } from "@/lib/audioPlayer"
import { pauseAudio, playAudio, updateProgress } from "@/lib/features/slices/audio/audioSlice"
import { Heart, Pause, Play, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const GlobalAudioPlayer = () => {
    const dispatch = useDispatch()
    const { currentAudio, isPlaying, progress } = useSelector((state) => state.audio)
    const audioRef = useRef(getAudio())
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)

    const [favouriteIds] = useGetFavoriteIds();
    const { toggleFavorite } = useFavoriteToggle();
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        toggleFavorite(currentAudio);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (audio.duration) {
                const newProgress = (audio.currentTime / audio.duration) * 100
                dispatch(updateProgress(newProgress))
            }
        };

        const handleAudioEnded = () => {
            dispatch(pauseAudio())
        };

        const handlePlay = () => dispatch(playAudio(currentAudio));
        const handlePause = () => dispatch(pauseAudio());

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", handleAudioEnded);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("ended", handleAudioEnded);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
        };
    }, [dispatch, currentAudio]);


    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (currentAudio) {
            if (audio.src !== currentAudio.audio_url) {
                audio.src = currentAudio.audio_url
                audio.load()
            }
            audio.volume = isMuted ? 0 : volume

            if (isPlaying) {
                audio.play().catch((e) => console.log("Error playing audio:", e))
            } else {
                audio.pause()
            }
        } else {
            audio.pause()
            audio.src = ""
        }
    }, [currentAudio, isPlaying, volume, isMuted])


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
        const audio = audioRef.current;
        if (audio && audio.duration) {
            audio.currentTime = (value[0] / 100) * audio.duration
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
                        <Button
                            variant="default"
                            size="icon"
                            onClick={handlePlayPauseClick}
                            className="rounded-full h-12 w-12 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform duration-200 hover:scale-105"
                        >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                        </Button>
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