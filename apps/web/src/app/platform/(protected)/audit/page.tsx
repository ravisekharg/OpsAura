"use client"

import { useEffect, useState } from "react"
import { Search, Loader2, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { platformApi } from "@/lib/platform-api"
import { useSearchParams } from "next/navigation"

interface AuditEvent {
  id: string; action: string; actorEmail?: string; target?: string
  detail?: string; createdAt: string
  tenant?: { slug: string; name: string } | null
}

function fmt(d: string) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })
}

export default function PlatformAuditPage() {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [tenantFilter, setTenantFilter] = useState(searchParams.get("tenantId") ?? "")
  const [page, setPage] = useState(1)

  const load = () => {
    const params: Record<string, unknown> = { page, limit: 50 }
    if (search) params.action = search
    if (tenantFilter) params.tenantId = tenantFilter
    setLoading(true)
    platformApi.get<{ data: AuditEvent[]; meta: { total: number } }>("/platform/audit", params)
      .then((r) => { setEvents(r.data); setTotal(r.meta?.total ?? r.data.length) })
      .catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, tenantFilter])
  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [search])

  function exportCSV() {
    const header = "Timestamp,Action,Tenant,Actor,Target,Detail"
    const rows = events.map((e) => [fmt(e.createdAt), e.action, e.tenant?.slug ?? "platform", e.actorEmail ?? "system", e.target ?? "", `"${e.detail ?? ""}"`].join(","))
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = `platform-audit-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const totalPages = Math.ceil(total / 50)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Platform Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{total} events recorded</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-border text-xs text-muted-foreground hover:bg-muted transition-colors">
          <Download className="h-3.5 w-3.5" />Export CSV
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by action…"
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <input value={tenantFilter} onChange={(e) => { setTenantFilter(e.target.value); setPage(1) }}
          placeholder="Filter by tenant ID…"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-48" />
        {(search || tenantFilter) && (
          <button onClick={() => { setSearch(""); setTenantFilter(""); setPage(1) }}
            className="text-xs text-muted-foreground hover:text-foreground">Clear filters</button>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-44">Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>}
            {!loading && events.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">No audit events found</TableCell></TableRow>}
            {events.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">{fmt(e.createdAt)}</TableCell>
                <TableCell><Badge variant="outline" className="text-[10px] font-mono">{e.action}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{e.tenant?.slug ?? <span className="text-amber-500 font-medium">platform</span>}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{e.actorEmail ?? "system"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{e.target ?? "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{e.detail ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Page {page} of {totalPages} · {total} total</p>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="h-7 px-2 rounded border border-border text-xs text-muted-foreground disabled:opacity-40 hover:bg-muted transition-colors">← Prev</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="h-7 px-2 rounded border border-border text-xs text-muted-foreground disabled:opacity-40 hover:bg-muted transition-colors">Next →</button>
          </div>
        </div>
      )}
    </div>
  )
}
