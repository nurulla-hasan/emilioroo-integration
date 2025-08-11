"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Headphones, Clock } from "lucide-react"

function pluralize(n, word = "audio") {
  const v = Number(n ?? 0)
  return `${v} ${v === 1 ? word : `${word}s`}`
}

function isNew(createdAt, days = 7) {
  if (!createdAt) return false
  const created = new Date(createdAt).getTime()
  const diff = Date.now() - created
  return diff <= days * 24 * 60 * 60 * 1000
}

function timeAgo(createdAt) {
  if (!createdAt) return ""
  const s = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
  if (s < 60) return "Just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

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
          <span className="tabular-nums">{pluralize(topic.audioCount)}</span>
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
          {typeof topic.audioCount === "number" ? pluralize(topic.audioCount) : ""}
        </p>

        <Button
          size="sm"
          variant="outline"
          className="mt-1 w-full border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        >
          <Play className="mr-2 h-4 w-4" />
          Listen Now
        </Button>
      </div>
    </div>
  )
}
