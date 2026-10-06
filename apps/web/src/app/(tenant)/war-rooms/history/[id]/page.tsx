"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useWarRoomStore } from "@/store/war-room-store"
import { WarRoomStatusBadge } from "@/components/war-rooms/war-room-badge"
import { WarRoomTimeline } from "@/components/war-rooms/war-room-timeline"
import { WarRoomActions } from "@/components/war-rooms/war-room-actions"
import { WarRoomParticipants } from "@/components/war-rooms/war-room-participants"
import { SeverityBadge } from "@/components/alerts/alert-badges"

export default function WarRoomHistoryDetailPage({ params }: { params: { id: string } }) {
  const rooms = useWarRoomStore((s) => s.rooms)
  const room = rooms.find((r) => r.id === params.id)

  if (!room) return notFound()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <Link href="/war-rooms/history" className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <WarRoomStatusBadge status={room.status} />
            <SeverityBadge severity={room.severity} />
            {room.service && <Badge variant="outline" className="text-xs">{room.service}</Badge>}
          </div>
          <h1 className="mt-1.5 text-lg font-semibold text-foreground">{room.title}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            IC: <span className="text-foreground font-medium">{room.incidentCommander}</span>
            {room.resolvedAt && <> · Resolved {room.resolvedAt.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}</>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <WarRoomActions roomId={room.id} actions={room.actions} readonly />
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <WarRoomTimeline roomId={room.id} events={room.timeline} />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 h-fit">
          <WarRoomParticipants roomId={room.id} participants={room.participants} readonly />
        </div>
      </div>
    </div>
  )
}
