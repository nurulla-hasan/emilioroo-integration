"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ListMusic, Share2 } from "lucide-react"

const PlaylistCard = ({ playlist = {} }) => {
  const audioCount = playlist?.audios?.length || 0

  return (
    <Card className="overflow-hidden rounded-xl border border-gray-200/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md hover:ring-1 hover:ring-primary/20">
      {/* Cover */}
      <div className="relative w-full aspect-video">
        <Image
          src={playlist?.cover_image}
          alt={playlist?.name || "Playlist Cover"}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority={true}
        />

        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent" />

        {/* Audio count pill */}
        <Badge className="absolute bottom-2 left-2 bg-black/60 text-white hover:bg-black/60 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
          <span className="inline-flex items-center gap-1">
            <ListMusic className="h-3.5 w-3.5" />
            <span className="tabular-nums">{audioCount}</span> audio
          </span>
        </Badge>
      </div>

      {/* Body */}
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-1 text-lg font-semibold">{playlist?.name}</h3>

        <div className="mb-4 flex items-center text-sm text-muted-foreground">
          <ListMusic className="mr-1 h-4 w-4" />
          <span className="tabular-nums">{audioCount}</span>
          <span className="ml-1">{audioCount === 1 ? "audio" : "audios"}</span>
        </div>

        <div className="flex gap-2">
          {/* View as link button */}
          <Button asChild size="sm" className="flex-1">
            <Link href={`/chatting/playlist/${playlist?._id || ""}`}>
              <Eye className="mr-1 h-4 w-4" />
              View
            </Link>
          </Button>

          {/* Share button (UI only) */}
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-gray-300 bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              // Hook up your share logic here (e.g., navigator.share / copy link)
            }}
          >
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PlaylistCard
