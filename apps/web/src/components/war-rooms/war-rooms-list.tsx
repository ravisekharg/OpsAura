"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Users, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWarRoomStore, type WarRoomStatus } from "@/store/war-room-store"
import { WarRoomStatusBadge } from "./war-room-badge"
import { CreateWarRoomDialog } from "./create-war-room-dialog"
import { SeverityBadge } from "@/components/alerts/alert-badges"

function timeAgo(date: Date) {
  const m = Math.floor((Date.now() - date.getTime()) / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

interface Props { filter: WarRoomStatus }

export function WarRoomsList({ filter }: Props) {
  const rooms = useWarRoomStore((s) => s.rooms)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filtered = rooms
    .filter((r) => r.status === filter)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="flex flex-col gap-4">
      {filter === "active" && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />Open War Room
          </Button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16 text-muted-foreground">
          <Users className="h-8 w-8 mb-3 opacity-30" />
          <p className="text-sm">No {filter} war rooms</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((room) => {
          const href = `/war-rooms/${filter === "active" ? "active" : "history"}/${room.id}`
          const openActions = room.actions.filter((a) => a.status !== "done").length
          const doneActions = room.actions.filter((a) => a.status === "done").length

          return (
            <Link key={room.id} href={href} className="block">
              <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <WarRoomStatusBadge status={room.status} />
                      <SeverityBadge severity={room.severity} />
                      {room.service && <Badge variant="outline" className="text-xs">{room.service}</Badge>}
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-foreground leading-snug">{room.title}</h3>
                    {room.description && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{room.description}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(room.createdAt)}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{room.participants.length} participants</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>IC: <span className="text-foreground font-medium">{room.incidentCommander}</span></span>
                  {room.actions.length > 0 && (
                    <span>{doneActions}/{room.actions.length} actions done</span>
                  )}
                  <span>{room.timeline.length} timeline events</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <CreateWarRoomDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}
