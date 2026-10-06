"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, CreditCard, TrendingUp, Users, ArrowRight, Plus, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { platformApi } from "@/lib/platform-api"

interface Tenant { id: string; slug: string; name: string; status: string; plan?: { name: string } | null; createdAt: string }
interface BillingOverview {
  activeTenants: number; trialingSubscriptions: number; mrr: number
  plans: Array<{ id: string; name: string; tenantCount: number; priceMonthly: number }>
  subscriptionBreakdown: Array<{ status: string; count: number }>
}

const statusVariant: Record<string, any> = {
  ACTIVE: "success", ONBOARDING: "warning", SUSPENDED: "destructive", CANCELLED: "secondary",
}

function StatCard({ label, value, sub, icon: Icon, href, color = "text-primary" }: any) {
  return (
    <Link href={href} className="block">
      <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">{label}</p>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <Icon className={`h-3.5 w-3.5 ${color}`} />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </Link>
  )
}

export default function PlatformDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [billing, setBilling] = useState<BillingOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([
      platformApi.get<{ data: Tenant[] }>("/platform/tenants"),
      platformApi.get<{ data: BillingOverview }>("/platform/billing/overview"),
    ])
      .then(([t, b]) => { setTenants(t.data); setBilling(b.data) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const activeTenants = tenants.filter((t) => t.status === "ACTIVE")
  const recentTenants = [...tenants].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Platform Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">All tenants, billing and platform health at a glance.</p>
        </div>
        <Link href="/platform/tenants/new"
          className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />Provision Tenant
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error} — Is the API running at localhost:4100?
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Tenants" value={loading ? "—" : activeTenants.length} sub="Fully operational" icon={Building2} href="/platform/tenants" />
        <StatCard label="Trialing" value={loading ? "—" : billing?.trialingSubscriptions ?? 0} sub="14-day trial" icon={Users} href="/platform/subscriptions" color="text-amber-500" />
        <StatCard label="MRR" value={loading ? "—" : `$${billing?.mrr ?? 0}`} sub="Monthly recurring" icon={CreditCard} href="/platform/billing" color="text-emerald-500" />
        <StatCard label="Total Tenants" value={loading ? "—" : tenants.length} sub="All time" icon={TrendingUp} href="/platform/tenants" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Tenants */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Tenants</h2>
            <Link href="/platform/tenants" className="flex items-center gap-1 text-xs text-primary hover:underline">
              All tenants <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : recentTenants.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No tenants yet.{" "}
              <Link href="/platform/tenants/new" className="text-primary hover:underline">Provision one →</Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentTenants.map((t) => (
                <Link key={t.id} href={`/platform/tenants/${t.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{t.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.plan && <Badge variant="secondary" className="text-xs">{t.plan.name}</Badge>}
                    <Badge variant={statusVariant[t.status]}>{t.status}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Plan Distribution */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Plan Distribution</h2>
            <Link href="/platform/plans" className="flex items-center gap-1 text-xs text-primary hover:underline">
              Manage plans <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : !billing?.plans.length ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No plans configured.</div>
          ) : (
            <div className="divide-y divide-border">
              {billing.plans.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">${p.priceMonthly}/mo</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{p.tenantCount}</p>
                    <p className="text-xs text-muted-foreground">tenants</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subscription Status Breakdown */}
      {billing?.subscriptionBreakdown && billing.subscriptionBreakdown.length > 0 && (
        <div className="rounded-lg border border-border bg-card">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Subscription Status</h2>
          </div>
          <div className="grid grid-cols-2 gap-0 sm:grid-cols-4 divide-x divide-border">
            {billing.subscriptionBreakdown.map((b) => (
              <div key={b.status} className="px-4 py-4 text-center">
                <p className="text-2xl font-bold text-foreground">{b.count}</p>
                <Badge variant={statusVariant[b.status] ?? "secondary"} className="mt-1 text-xs">{b.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
