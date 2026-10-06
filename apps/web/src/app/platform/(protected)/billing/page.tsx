"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { platformApi } from "@/lib/platform-api"

interface BillingOverview {
  activeTenants: number; trialingSubscriptions: number; mrr: number
  plans: Array<{ id: string; name: string; tenantCount: number; priceMonthly: number }>
  subscriptionBreakdown: Array<{ status: string; count: number }>
}
interface Sub {
  id: string; status: string; billingCycle: string; startsAt: string; endsAt?: string
  tenant: { slug: string; name: string }
  plan: { name: string; priceMonthly: number }
}

const sv: Record<string, any> = { ACTIVE: "success", TRIALING: "warning", PAST_DUE: "destructive", CANCELLED: "secondary" }

export default function BillingPage() {
  const [overview, setOverview] = useState<BillingOverview | null>(null)
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    Promise.all([
      platformApi.get<{ data: BillingOverview }>("/platform/billing/overview"),
      platformApi.get<{ data: Sub[] }>("/platform/billing/subscriptions"),
    ]).then(([o, s]) => { setOverview(o.data); setSubs(s.data) })
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  const filteredSubs = subs.filter((s) => statusFilter === "ALL" || s.status === statusFilter)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Billing Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Revenue, plans and subscription health.</p>
      </div>

      {loading ? <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div> : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "MRR", value: `$${overview?.mrr ?? 0}`, sub: "Monthly recurring revenue" },
              { label: "Active Tenants", value: overview?.activeTenants ?? 0, sub: "Fully operational" },
              { label: "Trialing", value: overview?.trialingSubscriptions ?? 0, sub: "14-day trial" },
              { label: "Total Subscriptions", value: subs.length, sub: "All statuses" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-2">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card">
              <div className="px-4 py-3 border-b border-border"><h2 className="text-sm font-semibold">Plan Distribution</h2></div>
              <div className="divide-y divide-border">
                {overview?.plans.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">${p.priceMonthly}/mo · {p.tenantCount} tenants</p>
                    </div>
                    <p className="text-xl font-bold text-primary">${(p.priceMonthly * p.tenantCount).toFixed(0)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card">
              <div className="px-4 py-3 border-b border-border"><h2 className="text-sm font-semibold">Status Breakdown</h2></div>
              <div className="divide-y divide-border">
                {overview?.subscriptionBreakdown.map((b) => (
                  <div key={b.status} className="flex items-center justify-between px-4 py-3">
                    <Badge variant={sv[b.status]}>{b.status}</Badge>
                    <span className="text-xl font-bold text-foreground">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All subscriptions */}
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold">All Subscriptions</h2>
              <div className="flex gap-1">
                {["ALL", "ACTIVE", "TRIALING", "PAST_DUE", "CANCELLED"].map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead>
                  <TableHead>Cycle</TableHead><TableHead>Started</TableHead><TableHead>MRR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubs.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No subscriptions</TableCell></TableRow>}
                {filteredSubs.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <p className="font-medium">{s.tenant.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{s.tenant.slug}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.plan.name}</TableCell>
                    <TableCell><Badge variant={sv[s.status]}>{s.status}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground capitalize">{s.billingCycle.toLowerCase()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(s.startsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                    <TableCell className="font-medium">${s.plan.priceMonthly}/mo</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
