"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Headphones, Clock } from "lucide-react"
import { isNew, timeAgo } from "@/lib/utils"
import Link from "next/link"

export default function TrendingTopicCard({topic}) {
  const fresh = isNew(topic.createdAt)

  return (
    <div className="group w-full mx-auto overflow-hidden rounded-2xl border bg-primary shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md">
      {/* Media */}
      <div className="relative w-full aspect-video">
        <Image
          src={topic.topic_image}
          alt={topic.name || "Topic Image"}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent transition-colors duration-300 group-hover:from-black/60 group-hover:via-black/40" />

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          {fresh && <Badge className="bg-white text-primary hover:bg-white">New</Badge>}
        </div>

        {/* Bottom left: audio count */}
        <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
          <Headphones className="h-3.5 w-3.5" />
          <span className="tabular-nums">{topic.totalAudios} Audio</span>
        </div>

        {/* Bottom right: time ago */}
        {topic.createdAt && (
          <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeAgo(topic.createdAt)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="truncate text-xl font-semibold leading-tight text-white">{topic.name}</h3>

        <p className="text-sm leading-snug text-white/80">
          {typeof topic.totalAudios === "number" ? topic.totalAudios : ""} Audio
        </p>

        <Link href={`/chatting/trending/${topic._id}`}>
          <Button
            size="sm"
            variant="outline"
            className="mt-1 w-full border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <Play className="mr-2 h-4 w-4" />
            Listen Now
          </Button>
        </Link>
      </div>
    </div>
  )
}
