"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useOnCallStore } from "@/store/oncall-store"
import { OverrideDialog } from "./override-dialog"

function fmt(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })
}

export function OverridesTable() {
  const { overrides, removeOverride } = useOnCallStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const now = new Date()

  const sorted = [...overrides].sort((a, b) => a.startAt.getTime() - b.startAt.getTime())

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />New Override
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Schedule</TableHead>
              <TableHead>Original On-Call</TableHead>
              <TableHead>Override With</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-10">No overrides</TableCell></TableRow>
            )}
            {sorted.map((o) => {
              const isActive = o.startAt <= now && o.endAt >= now
              const isPast = o.endAt < now
              return (
                <TableRow key={o.id}>
                  <TableCell className="text-muted-foreground text-xs">{o.scheduleName}</TableCell>
                  <TableCell className="text-muted-foreground">{o.originalUser}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{o.overrideUser}</span>
                      {isActive && <Badge variant="success" className="text-[10px]">Active</Badge>}
                      {isPast && <Badge variant="secondary" className="text-[10px]">Past</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{fmt(o.startAt)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{fmt(o.endAt)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{o.reason}</TableCell>
                  <TableCell>
                    <button onClick={() => removeOverride(o.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <OverrideDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}
