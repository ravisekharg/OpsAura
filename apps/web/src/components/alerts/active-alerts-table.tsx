"use client"

import { useState } from "react"
import { Search, CheckCheck, CheckCircle2, RefreshCw } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAlertStore, type AlertSeverity } from "@/store/alert-store"
import { useAuthStore } from "@/store/auth-store"
import { SeverityBadge, StatusBadge } from "./alert-badges"

function timeAgo(date: Date) {
  const m = Math.floor((Date.now() - date.getTime()) / 60000)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

const SEVERITIES: AlertSeverity[] = ["critical", "high", "medium", "low", "info"]

export function ActiveAlertsTable() {
  const { alerts, acknowledge, resolve } = useAlertStore()
  const user = useAuthStore((s) => s.user)
  const [search, setSearch] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")

  const active = alerts.filter((a) => a.status === "firing" || a.status === "acknowledged")
  const filtered = active.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.service.toLowerCase().includes(search.toLowerCase())
    const matchSeverity = severityFilter === "all" || a.severity === severityFilter
    return matchSearch && matchSeverity
  })

  const criticalCount = active.filter((a) => a.severity === "critical").length
  const highCount = active.filter((a) => a.severity === "high").length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        {criticalCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-500">{criticalCount} Critical</span>
          </div>
        )}
        {highCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-sm font-medium text-amber-500">{highCount} High</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search alerts…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            {SEVERITIES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Fired</TableHead>
              <TableHead>Dedup</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-10">No active alerts</TableCell></TableRow>
            )}
            {filtered.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  <div>
                    <p className="font-medium leading-none">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{alert.description}</p>
                    {alert.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {alert.tags.map((t) => <Badge key={t} variant="outline" className="text-[10px] px-1 py-0">{t}</Badge>)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell><SeverityBadge severity={alert.severity} /></TableCell>
                <TableCell><StatusBadge status={alert.status} /></TableCell>
                <TableCell className="text-muted-foreground text-xs">{alert.service}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{alert.assignedTo || "—"}</TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{timeAgo(alert.firedAt)}</TableCell>
                <TableCell className="text-center">
                  {alert.dedupCount > 1 && <Badge variant="outline" className="text-xs">{alert.dedupCount}×</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {alert.status === "firing" && (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => acknowledge(alert.id, user?.name ?? "Unknown")}>
                        <CheckCheck className="h-3 w-3 mr-1" />ACK
                      </Button>
                    )}
                    {(alert.status === "firing" || alert.status === "acknowledged") && (
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-emerald-500 hover:text-emerald-600" onClick={() => resolve(alert.id)}>
                        <CheckCircle2 className="h-3 w-3 mr-1" />Resolve
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
