"use client"

import { useEffect, useState } from "react"
import { Plus, ToggleLeft, ToggleRight, Loader2, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { platformApi } from "@/lib/platform-api"

interface Tenant { id: string; slug: string; name: string }
interface FFlag {
  id: string; name: string; enabled: boolean
  overrides: Array<{ enabled: boolean; tenant: { id: string; slug: string; name: string } }>
}

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FFlag[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [overrideState, setOverrideState] = useState<{ flagId: string; tenantId: string; enabled: boolean } | null>(null)

  const load = () => Promise.all([
    platformApi.get<{ data: FFlag[] }>("/platform/feature-flags"),
    platformApi.get<{ data: Tenant[] }>("/platform/tenants"),
  ]).then(([f, t]) => { setFlags(f.data); setTenants(t.data) })
    .catch(console.error).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  async function createFlag(e: React.FormEvent) {
    e.preventDefault()
    await platformApi.post("/platform/feature-flags", { name: newName, enabled: false })
    setNewName(""); setShowAdd(false); load()
  }

  async function toggle(flag: FFlag) {
    await platformApi.patch(`/platform/feature-flags/${flag.id}/toggle`, { enabled: !flag.enabled })
    load()
  }

  async function setTenantOverride(flagId: string, tenantId: string, enabled: boolean) {
    await platformApi.post(`/platform/feature-flags/${flagId}/overrides`, { tenantId, enabled })
    setOverrideState(null); load()
  }

  async function removeOverride(flagId: string, tenantId: string) {
    await platformApi.delete(`/platform/feature-flags/${flagId}/overrides/${tenantId}`)
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Feature Flags</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Control feature availability globally or per tenant.</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />New Flag
        </button>
      </div>

      {showAdd && (
        <form onSubmit={createFlag} className="flex gap-2 p-4 rounded-lg border border-primary/30 bg-primary/5">
          <input required value={newName} onChange={(e) => setNewName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            placeholder="feature_name (snake_case)" pattern="[a-z0-9_]+"
            className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
          <button type="button" onClick={() => setShowAdd(false)}
            className="h-9 px-3 rounded-md border border-border text-xs text-muted-foreground">Cancel</button>
          <button type="submit" className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium">Create</button>
        </form>
      )}

      {loading ? <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div> : (
        <div className="flex flex-col gap-3">
          {flags.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">No feature flags yet.</p>}
          {flags.map((flag) => (
            <div key={flag.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium">{flag.name}</span>
                  <Badge variant={flag.enabled ? "success" : "secondary"} className="text-xs">
                    {flag.enabled ? "Enabled globally" : "Disabled globally"}
                  </Badge>
                </div>
                <button onClick={() => toggle(flag)} className="flex items-center gap-1.5 text-xs">
                  {flag.enabled
                    ? <><ToggleRight className="h-5 w-5 text-emerald-500" /><span className="text-emerald-500">On</span></>
                    : <><ToggleLeft className="h-5 w-5 text-muted-foreground" /><span className="text-muted-foreground">Off</span></>}
                </button>
              </div>

              {/* Tenant Overrides */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tenant Overrides</p>
                  <button onClick={() => setOverrideState({ flagId: flag.id, tenantId: "", enabled: true })}
                    className="text-[10px] text-primary hover:underline">+ Add override</button>
                </div>
                {flag.overrides.length === 0
                  ? <p className="text-xs text-muted-foreground/50">No per-tenant overrides</p>
                  : (
                    <div className="flex flex-wrap gap-1.5">
                      {flag.overrides.map((o) => (
                        <div key={o.tenant.id} className={`flex items-center gap-1 px-2 py-0.5 rounded border text-xs ${o.enabled ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-500" : "border-destructive/30 bg-destructive/5 text-destructive"}`}>
                          <span>{o.tenant.name}</span>
                          <span className="text-[10px]">({o.enabled ? "on" : "off"})</span>
                          <button onClick={() => removeOverride(flag.id, o.tenant.id)} className="ml-1 hover:opacity-70">
                            <Trash2 className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                {overrideState?.flagId === flag.id && (
                  <div className="mt-2 flex items-center gap-2 p-2 rounded border border-border bg-muted/20">
                    <select value={overrideState.tenantId}
                      onChange={(e) => setOverrideState((s) => s ? { ...s, tenantId: e.target.value } : null)}
                      className="flex-1 h-8 rounded border border-input bg-background px-2 text-xs focus:outline-none">
                      <option value="">Select tenant</option>
                      {tenants.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.slug})</option>)}
                    </select>
                    <select value={String(overrideState.enabled)}
                      onChange={(e) => setOverrideState((s) => s ? { ...s, enabled: e.target.value === "true" } : null)}
                      className="h-8 w-20 rounded border border-input bg-background px-2 text-xs focus:outline-none">
                      <option value="true">Enable</option>
                      <option value="false">Disable</option>
                    </select>
                    <button onClick={() => overrideState.tenantId && setTenantOverride(flag.id, overrideState.tenantId, overrideState.enabled)}
                      disabled={!overrideState.tenantId}
                      className="h-8 px-2 rounded bg-primary text-primary-foreground text-xs disabled:opacity-50">Save</button>
                    <button onClick={() => setOverrideState(null)} className="h-8 px-2 rounded border border-border text-xs">✕</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
