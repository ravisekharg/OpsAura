"use client"

import Link from "next/link"
import { ArrowRight, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useWarRoomStore } from "@/store/war-room-store"
import { SeverityBadge } from "@/components/alerts/alert-badges"

function timeAgo(date: Date) {
  const m = Math.floor((Date.now() - date.getTime()) / 60000)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

export function DashboardWarRooms() {
  const rooms = useWarRoomStore((s) => s.rooms)
  const active = rooms.filter((r) => r.status === "active")

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Active War Rooms</h2>
        <Link href="/war-rooms/active" className="flex items-center gap-1 text-xs text-primary hover:underline">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {active.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Users className="h-6 w-6 mb-2 opacity-30" />
          <p className="text-sm">No active war rooms</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {active.map((room) => {
            const openActions = room.actions.filter((a) => a.status !== "done").length
            return (
              <Link key={room.id} href={`/war-rooms/active/${room.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors block">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={room.severity} />
                    <span className="text-xs text-muted-foreground">{timeAgo(room.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground line-clamp-1">{room.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    IC: {room.incidentCommander} · {room.participants.length} participants
                    {openActions > 0 && ` · ${openActions} open actions`}
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
