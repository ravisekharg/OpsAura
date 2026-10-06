"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Loader2, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { platformApi } from "@/lib/platform-api"

interface Plan {
  id: string; name: string; priceMonthly: number
  features: Record<string, boolean>; limits: Record<string, number>
  _count: { tenants: number; subscriptions: number }
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", priceMonthly: "0", userLimit: "50", serviceLimit: "100", scheduleLimit: "10" })

  const load = () => platformApi.get<{ data: Plan[] }>("/platform/plans")
    .then((r) => setPlans(r.data)).catch(console.error).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const data = {
      name: form.name,
      priceMonthly: Number(form.priceMonthly),
      features: { voice: true, war_rooms: true, servicenow: true, escalations: true, oncall: true, alerts: true },
      limits: { users: Number(form.userLimit), services: Number(form.serviceLimit), schedules: Number(form.scheduleLimit) },
    }
    try {
      if (editingId) await platformApi.patch(`/platform/plans/${editingId}`, data)
      else await platformApi.post("/platform/plans", data)
      setShowForm(false); setEditingId(null)
      setForm({ name: "", priceMonthly: "0", userLimit: "50", serviceLimit: "100", scheduleLimit: "10" })
      load()
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  function startEdit(p: Plan) {
    setEditingId(p.id)
    setForm({ name: p.name, priceMonthly: String(p.priceMonthly), userLimit: String(p.limits?.users ?? 50), serviceLimit: String(p.limits?.services ?? 100), scheduleLimit: String(p.limits?.schedules ?? 10) })
    setShowForm(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Plans</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Subscription plans with features and resource limits.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null) }}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />New Plan
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
          <h2 className="text-sm font-semibold mb-4">{editingId ? "Edit Plan" : "Create Plan"}</h2>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Plan Name</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Enterprise"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Monthly Price (USD)</label>
                <input type="number" min="0" value={form.priceMonthly} onChange={(e) => setForm((f) => ({ ...f, priceMonthly: e.target.value }))}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ key: "userLimit", label: "Max Users" }, { key: "serviceLimit", label: "Max Services" }, { key: "scheduleLimit", label: "Max Schedules" }].map((f) => (
                <div key={f.key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium">{f.label}</label>
                  <input type="number" min="1" value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }}
                className="h-8 px-3 rounded-md border border-border text-xs text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
              <button type="submit" disabled={saving}
                className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {saving ? "Saving…" : editingId ? "Update Plan" : "Create Plan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.length === 0 && <p className="text-sm text-muted-foreground col-span-3 text-center py-10">No plans. Create one above.</p>}
          {plans.map((p) => (
            <div key={p.id} className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    ${p.priceMonthly}<span className="text-xs text-muted-foreground font-normal">/mo</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{p._count.tenants} tenants</Badge>
                  <button onClick={() => startEdit(p)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Limits</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(p.limits ?? {}).map(([k, v]) => (
                    <Badge key={k} variant="outline" className="text-xs">{k}: {v}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Features</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(p.features ?? {}).map(([k, v]) => (
                    <span key={k} className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded border ${v ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5" : "border-border text-muted-foreground/40"}`}>
                      {v && <Check className="h-2.5 w-2.5" />}{k.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
