"use client"

import { useState } from "react"
import { Plus, ToggleLeft, ToggleRight, Clock } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useOnCallStore } from "@/store/oncall-store"
import { ScheduleDialog } from "./schedule-dialog"

export function SchedulesTable() {
  const { schedules, rotations, toggleSchedule } = useOnCallStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />New Schedule
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Schedule</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Timezone</TableHead>
              <TableHead>Rotations</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((s) => {
              const rotCount = rotations.filter((r) => r.scheduleId === s.id).length
              return (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium leading-none">{s.name}</p>
                        {s.description && <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.team}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs font-mono">{s.timezone}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{rotCount} rotation{rotCount !== 1 ? "s" : ""}</TableCell>
                  <TableCell>
                    <button onClick={() => toggleSchedule(s.id)} className="flex items-center gap-1.5 text-xs">
                      {s.active
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
      <ScheduleDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}
