"use client"

import { useState } from "react"
import { Plus, ToggleLeft, ToggleRight } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useOnCallStore } from "@/store/oncall-store"
import { RotationDialog } from "./rotation-dialog"

export function RotationsTable() {
  const { rotations, schedules, toggleRotation } = useOnCallStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />New Rotation
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rotation</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Handoff</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rotations.map((r) => {
              const schedule = schedules.find((s) => s.id === r.scheduleId)
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{schedule?.name ?? "—"}</TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{r.type}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{r.handoffDay} {r.handoffTime}</TableCell>
                  <TableCell>
                    <div className="flex -space-x-1.5">
                      {r.members.slice(0, 4).map((m, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-card">
                          <AvatarFallback className="text-[9px]">{m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {r.members.length > 4 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[9px] text-muted-foreground">
                          +{r.members.length - 4}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleRotation(r.id)} className="flex items-center gap-1.5 text-xs">
                      {r.active
                        ? <><ToggleRight className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">Active</span></>
                        : <><ToggleLeft className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Inactive</span></>}
                    </button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <RotationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}
