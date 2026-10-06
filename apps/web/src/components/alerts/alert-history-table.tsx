"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useAlertStore } from "@/store/alert-store"
import { SeverityBadge, StatusBadge } from "./alert-badges"

function fmt(date?: Date) {
  if (!date) return "—"
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })
}

function duration(start: Date, end?: Date) {
  if (!end) return "—"
  const m = Math.floor((end.getTime() - start.getTime()) / 60000)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

export function AlertHistoryTable() {
  const alerts = useAlertStore((s) => s.alerts)
  const [search, setSearch] = useState("")

  const history = alerts
    .filter((a) => a.status === "resolved" || a.status === "suppressed")
    .filter((a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.service.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.resolvedAt?.getTime() ?? 0) - (a.resolvedAt?.getTime() ?? 0))

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-8" placeholder="Search history…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Resolved By</TableHead>
              <TableHead>Fired</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-10">No history</TableCell></TableRow>
            )}
            {history.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  <p className="font-medium leading-none">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{alert.description}</p>
                </TableCell>
                <TableCell><SeverityBadge severity={alert.severity} /></TableCell>
                <TableCell><StatusBadge status={alert.status} /></TableCell>
                <TableCell className="text-muted-foreground text-xs">{alert.service}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{alert.assignedTo || "—"}</TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{fmt(alert.firedAt)}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{duration(alert.firedAt, alert.resolvedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
