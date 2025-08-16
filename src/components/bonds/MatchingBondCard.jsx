"use client"

import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MapPin, Star, Pause, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const defaultBond = {
  id: 1,
  name: "John Smith",
  location: "New York, NY",
  distance: "3.2 km away",
  rating: 4.8,
  offers: "Cooking Cake",
  wants: "Teaching Math",
}

export default function MatchingBondCard({
  bond = defaultBond,
  onPause,
  onDelete,
  onRate,
  onConfirm,
}) {
  return (
    <CardContent className="p-4">
      {/* Inner light-blue panel */}
      <div className="rounded-md border border-primary/20 bg-primary/10 p-3 md:p-4">
        {/* Top row: avatar, name, location, rating, actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Replace Image with Avatar */}
            <Avatar className="h-10 w-10">
              <AvatarImage src={bond.avatar} alt={bond.name} />
              <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">
                {bond.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h4 className="font-bold text-[15px] md:text-base">{bond.name}</h4>

              <div className="mt-1 flex flex-wrap items-center gap-1 text-[13px] text-[#6b7280]">
                <MapPin className="h-4 w-4 opacity-80" />
                <span className="truncate">
                  {bond.location} ({bond.distance})
                </span>
              </div>

              <div className="mt-1 flex items-center text-[13px]">
                {/* 4 filled, one outline visual similar to ss with value */}
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 mr-1 ${i < Math.floor(bond.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300 fill-gray-200"
                      }`}
                  />
                ))}
                <span className="ml-1 text-[#6b7280]">{bond.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Right-side stacked actions like screenshot */}
          <div className="flex flex-col md:flex-row items-center gap-2 text-gray-500">
            <button
              aria-label="Pause"
              onClick={() => onPause?.(bond.id)}
            >
              <Pause className="h-4 w-4" />
            </button>
            <button
              aria-label="Delete"
              onClick={() => onDelete?.(bond.id)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* White info box: Offers / Wants */}
        <div className="mt-4 rounded-md border px-4 py-3 bg-accent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <Label className="text-[13px] font-semibold">Offers:</Label>
              <p className="text-sm  mt-1">{bond.offers}</p>
            </div>
            <div className="md:text-right">
              <Label className="text-[13px] font-semibold flex justify-end">Wants:</Label>
              <p className="text-sm mt-1">{bond.wants}</p>
            </div>
          </div>
        </div>

        {/* Bottom row: Rate link + Confirm button */}
        <div className="mt-4 flex flex-col md:flex-row gap-2 items-center justify-between">
          <button
            onClick={() => onRate?.(bond.id)}
            className="inline-flex items-center gap-2 text-sm  hover:underline"
          >
            <Star className="h-4 w-4" />
            Rate this bond
          </button>

          <Button
            size="sm"
            onClick={() => onConfirm?.(bond.id)}
            className=""
          >
            Confirm Meeting
          </Button>
        </div>
      </div>
    </CardContent>
  )
}
