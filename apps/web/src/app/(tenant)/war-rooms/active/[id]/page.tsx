"use client"

import { notFound, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useWarRoomStore } from "@/store/war-room-store"
import { WarRoomStatusBadge } from "@/components/war-rooms/war-room-badge"
import { WarRoomTimeline } from "@/components/war-rooms/war-room-timeline"
import { WarRoomActions } from "@/components/war-rooms/war-room-actions"
import { WarRoomParticipants } from "@/components/war-rooms/war-room-participants"
import { SeverityBadge } from "@/components/alerts/alert-badges"

export default function WarRoomDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { rooms, resolveRoom } = useWarRoomStore()
  const room = rooms.find((r) => r.id === params.id)

  if (!room) return notFound()

  const isActive = room.status === "active"

  function handleResolve() {
    if (!room) return
    resolveRoom(room.id)
    router.push("/war-rooms/active")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/war-rooms/active" className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <WarRoomStatusBadge status={room.status} />
              <SeverityBadge severity={room.severity} />
              {room.service && <Badge variant="outline" className="text-xs">{room.service}</Badge>}
            </div>
            <h1 className="mt-1.5 text-lg font-semibold text-foreground leading-snug">{room.title}</h1>
            {room.description && <p className="text-sm text-muted-foreground mt-0.5">{room.description}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              IC: <span className="text-foreground font-medium">{room.incidentCommander}</span>
              {" · "}Opened {room.createdAt.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}
            </p>
          </div>
        </div>
        {isActive && (
          <Button size="sm" variant="outline" className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10 shrink-0" onClick={handleResolve}>
            <CheckCircle2 className="h-4 w-4 mr-1.5" />Resolve Incident
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <WarRoomActions roomId={room.id} actions={room.actions} readonly={!isActive} />
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <WarRoomTimeline roomId={room.id} events={room.timeline} />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 h-fit">
          <WarRoomParticipants roomId={room.id} participants={room.participants} readonly={!isActive} />
        </div>
      </div>
    </div>
  )
}
