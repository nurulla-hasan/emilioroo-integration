"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CardSkeleton() {
  return (
    <Card className="w-full overflow-hidden shadow-lg bg-card">
      <CardHeader className="p-0 relative h-50">
        <Skeleton className="h-50 w-full" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  )
}
