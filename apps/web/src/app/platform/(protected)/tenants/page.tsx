"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, PauseCircle, PlayCircle, ExternalLink, Loader2 } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { platformApi } from "@/lib/platform-api"

interface Tenant {
  id: string; slug: string; name: string; status: string; domain?: string
  plan?: { name: string } | null
  subscriptions?: Array<{ status: string; billingCycle: string; startsAt: string }>
  createdAt: string; suspendedAt?: string
}

const statusVariant: Record<string, any> = {
  ACTIVE: "success", ONBOARDING: "warning", SUSPENDED: "destructive", CANCELLED: "secondary",
}

export default function PlatformTenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    platformApi.get<{ data: Tenant[] }>("/platform/tenants")
      .then((r) => setTenants(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = tenants.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter
    return matchSearch && matchStatus
  })

  async function handleSuspend(id: string) {
    setActionLoading(id)
    try {
      await platformApi.post(`/platform/tenants/${id}/suspend`)
      load()
    } catch (e) { console.error(e) }
    finally { setActionLoading(null) }
  }

  async function handleReactivate(id: string) {
    setActionLoading(id)
    try {
      await platformApi.patch(`/platform/tenants/${id}`, { status: "ACTIVE" })
      load()
    } catch (e) { console.error(e) }
    finally { setActionLoading(null) }
  }

  const STATUSES = ["ALL", "ACTIVE", "ONBOARDING", "SUSPENDED", "CANCELLED"]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Tenants</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tenants.length} tenant{tenants.length !== 1 ? "s" : ""} registered</p>
        </div>
        <Link href="/platform/tenants/new"
          className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />Provision Tenant
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search by name or slug…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1">
          {STATUSES.map((s) => (
            <button key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={7} className="text-center py-12">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
              </TableCell></TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                No tenants found
              </TableCell></TableRow>
            )}
            {filtered.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div>
                      <Link href={`/platform/tenants/${t.id}`} className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                        {t.name}<ExternalLink className="h-3 w-3" />
                      </Link>
                      <p className="text-xs text-muted-foreground font-mono">{t.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant={statusVariant[t.status]}>{t.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-sm">{t.plan?.name ?? <span className="text-muted-foreground/40">—</span>}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {t.subscriptions?.[0]
                    ? <><Badge variant={statusVariant[t.subscriptions[0].status] ?? "secondary"} className="text-[10px]">{t.subscriptions[0].status}</Badge></>
                    : <span className="text-muted-foreground/40">—</span>}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{t.domain ?? <span className="text-muted-foreground/40">—</span>}</TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {t.status === "ACTIVE" && (
                      <button
                        onClick={() => handleSuspend(t.id)}
                        disabled={actionLoading === t.id}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                      >
                        <PauseCircle className="h-3.5 w-3.5" />Suspend
                      </button>
                    )}
                    {t.status === "SUSPENDED" && (
                      <button
                        onClick={() => handleReactivate(t.id)}
                        disabled={actionLoading === t.id}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald-500 transition-colors disabled:opacity-50"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />Reactivate
                      </button>
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
