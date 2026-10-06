"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, PauseCircle, PlayCircle, Loader2, Building2, CreditCard, Calendar, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { platformApi } from "@/lib/platform-api"

interface TenantDetail {
  id: string; slug: string; name: string; status: string; domain?: string
  plan?: { id: string; name: string; features: Record<string, boolean>; limits: Record<string, number>; priceMonthly: number } | null
  subscriptions?: Array<{ id: string; status: string; billingCycle: string; startsAt: string; endsAt?: string }>
  createdAt: string; suspendedAt?: string
}

const statusVariant: Record<string, any> = {
  ACTIVE: "success", ONBOARDING: "warning", SUSPENDED: "destructive", CANCELLED: "secondary",
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground w-36 shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  )
}

export default function TenantDetailPage({ params }: { params: { id: string } }) {
  const [tenant, setTenant] = useState<TenantDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const load = () => {
    platformApi.get<{ data: TenantDetail }>(`/platform/tenants/${params.id}`)
      .then((r) => setTenant(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [params.id])

  async function handleSuspend() {
    setActionLoading(true)
    try { await platformApi.post(`/platform/tenants/${params.id}/suspend`); load() }
    catch (e) { console.error(e) } finally { setActionLoading(false) }
  }

  async function handleReactivate() {
    setActionLoading(true)
    try { await platformApi.patch(`/platform/tenants/${params.id}`, { status: "ACTIVE" }); load() }
    catch (e) { console.error(e) } finally { setActionLoading(false) }
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )

  if (!tenant) return (
    <div className="text-center py-16 text-muted-foreground">Tenant not found.</div>
  )

  const activeSub = tenant.subscriptions?.[0]

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/platform/tenants" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">{tenant.name}</h1>
            <Badge variant={statusVariant[tenant.status]}>{tenant.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">/{tenant.slug}</p>
        </div>
        <div className="flex gap-2">
          {tenant.status === "ACTIVE" && (
            <button onClick={handleSuspend} disabled={actionLoading}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-border text-xs text-muted-foreground hover:text-destructive hover:border-destructive transition-colors disabled:opacity-50">
              <PauseCircle className="h-3.5 w-3.5" />Suspend
            </button>
          )}
          {tenant.status === "SUSPENDED" && (
            <button onClick={handleReactivate} disabled={actionLoading}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-emerald-500/30 text-xs text-emerald-500 hover:bg-emerald-500/10 transition-colors disabled:opacity-50">
              <PlayCircle className="h-3.5 w-3.5" />Reactivate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tenant Info */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Tenant Information</h2>
          </div>
          <InfoRow label="Name" value={tenant.name} />
          <InfoRow label="Slug" value={<span className="font-mono">{tenant.slug}</span>} />
          <InfoRow label="Database" value={<span className="font-mono text-xs">tenant_{tenant.slug}</span>} />
          <InfoRow label="Status" value={<Badge variant={statusVariant[tenant.status]}>{tenant.status}</Badge>} />
          <InfoRow label="Domain" value={tenant.domain ?? <span className="text-muted-foreground">Not configured</span>} />
          <InfoRow label="Created" value={new Date(tenant.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
          {tenant.suspendedAt && (
            <InfoRow label="Suspended" value={new Date(tenant.suspendedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
          )}
        </div>

        {/* Subscription */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Subscription</h2>
          </div>
          {activeSub ? (
            <>
              <InfoRow label="Status" value={<Badge variant={statusVariant[activeSub.status] ?? "secondary"}>{activeSub.status}</Badge>} />
              <InfoRow label="Plan" value={tenant.plan?.name ?? "—"} />
              <InfoRow label="Billing Cycle" value={<span className="capitalize">{activeSub.billingCycle.toLowerCase()}</span>} />
              <InfoRow label="Started" value={new Date(activeSub.startsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
              {activeSub.endsAt && (
                <InfoRow label="Ends" value={new Date(activeSub.endsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
              )}
              <InfoRow label="Monthly Price" value={`$${tenant.plan?.priceMonthly ?? 0}`} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">No active subscription</p>
          )}
        </div>

        {/* Plan Features */}
        {tenant.plan && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">Plan: {tenant.plan.name}</h2>
            <div className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Features</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(tenant.plan.features ?? {}).map(([k, v]) => (
                  <Badge key={k} variant={v ? "success" : "secondary"} className="text-xs capitalize">
                    {v ? "✓" : "✗"} {k.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Limits</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(tenant.plan.limits ?? {}).map(([k, v]) => (
                  <Badge key={k} variant="outline" className="text-xs">
                    {k}: {v}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <Link href={`/platform/subscriptions`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
              <CreditCard className="h-4 w-4" />Manage Subscription
            </Link>
            <Link href={`/platform/domains`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
              <Globe className="h-4 w-4" />Manage Domains
            </Link>
            <Link href={`/platform/audit?tenantId=${tenant.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
              <Calendar className="h-4 w-4" />View Audit Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
