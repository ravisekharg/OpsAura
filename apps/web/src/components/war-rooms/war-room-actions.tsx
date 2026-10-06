"use client"

import { useState } from "react"
import { Plus, Circle, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useWarRoomStore, type ActionItem, type ActionStatus } from "@/store/war-room-store"
import { cn } from "@/lib/utils"

const statusIcon: Record<ActionStatus, React.ReactNode> = {
  open:        <Circle className="h-4 w-4 text-muted-foreground" />,
  in_progress: <Clock className="h-4 w-4 text-amber-500" />,
  done:        <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
}

const statusVariant: Record<ActionStatus, "secondary" | "warning" | "success"> = {
  open: "secondary", in_progress: "warning", done: "success",
}

interface Props { roomId: string; actions: ActionItem[]; readonly?: boolean }

export function WarRoomActions({ roomId, actions, readonly }: Props) {
  const { addAction, updateActionStatus } = useWarRoomStore()
  const [title, setTitle] = useState("")
  const [assignedTo, setAssignedTo] = useState("")

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    addAction(roomId, { title, assignedTo, status: "open" })
    setTitle(""); setAssignedTo("")
  }

  function cycleStatus(actionId: string, current: ActionStatus) {
    const next: Record<ActionStatus, ActionStatus> = { open: "in_progress", in_progress: "done", done: "open" }
    updateActionStatus(roomId, actionId, next[current])
  }

  const open = actions.filter((a) => a.status !== "done")
  const done = actions.filter((a) => a.status === "done")

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-foreground">Action Items</h3>

      <div className="flex flex-col gap-2">
        {open.map((action) => (
          <div key={action.id} className="flex items-center gap-2.5 rounded-md border border-border bg-card px-3 py-2.5">
            <button onClick={() => !readonly && cycleStatus(action.id, action.status)} className="shrink-0">
              {statusIcon[action.status]}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{action.title}</p>
              {action.assignedTo && <p className="text-xs text-muted-foreground">{action.assignedTo}</p>}
            </div>
            <Badge variant={statusVariant[action.status]} className="text-xs capitalize shrink-0">
              {action.status.replace("_", " ")}
            </Badge>
          </div>
        ))}

        {done.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground mt-1">Completed ({done.length})</p>
            {done.map((action) => (
              <div key={action.id} className="flex items-center gap-2.5 rounded-md border border-border bg-muted/20 px-3 py-2.5 opacity-60">
                <button onClick={() => !readonly && cycleStatus(action.id, action.status)} className="shrink-0">
                  {statusIcon[action.status]}
                </button>
                <p className={cn("text-sm flex-1 line-through text-muted-foreground")}>{action.title}</p>
              </div>
            ))}
          </>
        )}

        {actions.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No actions yet</p>
        )}
      </div>

      {!readonly && (
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Action item…" className="flex-1" />
          <Input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Assign to" className="w-32" />
          <Button type="submit" size="sm" disabled={!title.trim()}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </form>
      )}
    </div>
  )
}
