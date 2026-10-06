"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuditStore, type AuditCategory } from "@/store/audit-store"
import { AuditFilters, type AuditFilterState } from "./audit-filters"

const severityVariant: Record<string, "secondary" | "warning" | "destructive"> = {
  info: "secondary", warning: "warning", critical: "destructive",
}

const categoryVariant: Record<AuditCategory, string> = {
  auth: "text-violet-500", user: "text-sky-500", team: "text-blue-500",
  service: "text-indigo-500", schedule: "text-teal-500", oncall: "text-cyan-500",
  alert: "text-red-500", escalation: "text-orange-500", war_room: "text-rose-500",
  integration: "text-green-500", settings: "text-gray-500", tenant: "text-purple-500",
}

function fmt(date: Date) {
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })
}

function exportCSV(rows: ReturnType<typeof useAuditStore.getState>["events"]) {
  const header = "Timestamp,Category,Action,Actor,Target,Detail,Severity,IP"
  const lines = rows.map((e) =>
    [fmt(e.createdAt), e.category, e.action, e.actor, e.target, `"${e.detail}"`, e.severity, e.ipAddress].join(",")
  )
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = `audit-log-${Date.now()}.csv`; a.click()
  URL.revokeObjectURL(url)
}

interface Props { platformOnly?: boolean }

export function AuditTable({ platformOnly }: Props) {
  const events = useAuditStore((s) => s.events)
  const [filters, setFilters] = useState<AuditFilterState>({ search: "all", category: "all", severity: "all" })

  const source = platformOnly ? events.filter((e) => e.category === "tenant") : events

  const filtered = source.filter((e) => {
    const q = filters.search === "all" ? "" : filters.search.toLowerCase()
    const matchSearch = !q || e.action.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q) || e.target.toLowerCase().includes(q) || e.detail.toLowerCase().includes(q)
    const matchCategory = filters.category === "all" || e.category === filters.category
    const matchSeverity = filters.severity === "all" || e.severity === filters.severity
    return matchSearch && matchCategory && matchSeverity
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <AuditFilters
          filters={{ ...filters, search: filters.search === "all" ? "" : filters.search }}
          onChange={(f) => setFilters({ ...f, search: f.search || "all" })}
        />
        <Button size="sm" variant="outline" onClick={() => exportCSV(filtered)}>
          <Download className="h-4 w-4 mr-1.5" />Export CSV
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-44">Timestamp</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-10">No audit events</TableCell></TableRow>
            )}
            {filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap font-mono">{fmt(e.createdAt)}</TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold capitalize ${categoryVariant[e.category]}`}>
                    {e.category.replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-mono text-foreground">{e.action}</TableCell>
                <TableCell>
                  <p className="text-xs font-medium text-foreground">{e.actor}</p>
                  <p className="text-[10px] text-muted-foreground">{e.actorEmail}</p>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{e.target}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-xs">
                  <p className="line-clamp-2">{e.detail}</p>
                </TableCell>
                <TableCell><Badge variant={severityVariant[e.severity]} className="capitalize text-xs">{e.severity}</Badge></TableCell>
                <TableCell className="text-[10px] text-muted-foreground font-mono">{e.ipAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} events</p>
    </div>
  )
}
