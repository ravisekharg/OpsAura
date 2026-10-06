"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWarRoomStore, type TimelineEvent } from "@/store/war-room-store"
import { useAuthStore } from "@/store/auth-store"
import { cn } from "@/lib/utils"

const eventIcon: Record<string, string> = {
  opened: "🚨", joined: "👤", left: "👋", action_created: "✅", action_done: "✔️",
  status_changed: "🔄", note: "📝", alert_linked: "🔗", resolved: "🟢",
}

function fmt(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

interface Props { roomId: string; events: TimelineEvent[] }

export function WarRoomTimeline({ roomId, events }: Props) {
  const addTimelineEvent = useWarRoomStore((s) => s.addTimelineEvent)
  const user = useAuthStore((s) => s.user)
  const [note, setNote] = useState("")

  const sorted = [...events].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  function handleNote(e: React.FormEvent) {
    e.preventDefault()
    if (!note.trim()) return
    addTimelineEvent(roomId, { type: "note", actor: user?.name ?? "Unknown", message: note })
    setNote("")
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-foreground">Timeline</h3>

      <div className="flex flex-col gap-0">
        {sorted.map((event, i) => (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-sm shrink-0 border",
                event.type === "resolved" ? "bg-emerald-500/10 border-emerald-500/30" :
                event.type === "opened" ? "bg-red-500/10 border-red-500/30" :
                "bg-muted border-border"
              )}>
                {eventIcon[event.type] ?? "·"}
              </div>
              {i < sorted.length - 1 && <div className="w-px flex-1 bg-border my-1 min-h-[12px]" />}
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">{event.actor}</span>
                <span className="text-[10px] text-muted-foreground">{fmt(event.createdAt)}</span>
              </div>
              <p className={cn("text-xs mt-0.5", event.type === "note" ? "text-foreground" : "text-muted-foreground")}>
                {event.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleNote} className="flex gap-2">
        <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note to the timeline…" className="flex-1" />
        <Button type="submit" size="sm" disabled={!note.trim()}>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  )
}
