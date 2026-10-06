"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { platformApi } from "@/lib/platform-api"

interface Sub {
  id: string; status: string; billingCycle: string; startsAt: string; endsAt?: string
  tenant: { slug: string; name: string }
  plan: { name: string; priceMonthly: number }
}

const sv: Record<string, any> = { ACTIVE: "success", TRIALING: "warning", PAST_DUE: "destructive", CANCELLED: "secondary" }

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")
  const [actionId, setActionId] = useState<string | null>(null)

  const load = () => platformApi.get<{ data: Sub[] }>("/platform/subscriptions")
    .then((r) => setSubs(r.data)).catch(console.error).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  async function handleAction(id: string, action: "cancel" | "activate") {
    setActionId(id)
    try {
      if (action === "cancel") await platformApi.post(`/platform/subscriptions/${id}/cancel`)
      else await platformApi.patch(`/platform/subscriptions/${id}`, { status: "ACTIVE" })
      load()
    } catch (e) { console.error(e) } finally { setActionId(null) }
  }

  const filtered = subs.filter((s) => filter === "ALL" || s.status === filter)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Subscriptions</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{subs.length} total subscriptions</p>
      </div>

      <div className="flex gap-1 flex-wrap">
        {["ALL", "ACTIVE", "TRIALING", "PAST_DUE", "CANCELLED"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {s} {s !== "ALL" && `(${subs.filter((x) => x.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead>
              <TableHead>Billing Cycle</TableHead><TableHead>Started</TableHead><TableHead>MRR</TableHead><TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>}
            {!loading && filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-12">No subscriptions</TableCell></TableRow>}
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <p className="font-medium">{s.tenant.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{s.tenant.slug}</p>
                </TableCell>
                <TableCell className="text-muted-foreground">{s.plan.name}</TableCell>
                <TableCell><Badge variant={sv[s.status]}>{s.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground capitalize">{s.billingCycle.toLowerCase()}</TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(s.startsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>
                <TableCell className="font-medium">${s.plan.priceMonthly}/mo</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {s.status !== "CANCELLED" && (
                      <button onClick={() => handleAction(s.id, "cancel")} disabled={actionId === s.id}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50">
                        Cancel
                      </button>
                    )}
                    {(s.status === "PAST_DUE" || s.status === "CANCELLED") && (
                      <button onClick={() => handleAction(s.id, "activate")} disabled={actionId === s.id}
                        className="text-xs text-muted-foreground hover:text-emerald-500 transition-colors disabled:opacity-50 ml-2">
                        Reactivate
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
