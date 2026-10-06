"use client"

import { useEffect, useState } from "react"
import { Plus, CheckCircle2, Clock, Trash2, Loader2, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { platformApi } from "@/lib/platform-api"

interface Domain {
  id: string; domain: string; verified: boolean; verifiedAt?: string; createdAt: string
  tenant: { id: string; slug: string; name: string }
}
interface Tenant { id: string; slug: string; name: string }

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ tenantId: "", domain: "" })
  const [saving, setSaving] = useState(false)
  const [verifying, setVerifying] = useState<string | null>(null)

  const load = () => Promise.all([
    platformApi.get<{ data: Domain[] }>("/platform/domains"),
    platformApi.get<{ data: Tenant[] }>("/platform/tenants"),
  ]).then(([d, t]) => { setDomains(d.data); setTenants(t.data) })
    .catch(console.error).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try { await platformApi.post("/platform/domains", form); setShowAdd(false); setForm({ tenantId: "", domain: "" }); load() }
    catch (e) { console.error(e) } finally { setSaving(false) }
  }

  async function handleVerify(id: string) {
    setVerifying(id)
    try { await platformApi.post(`/platform/domains/${id}/verify`); load() }
    catch (e) { console.error(e) } finally { setVerifying(null) }
  }

  async function handleDelete(id: string) {
    await platformApi.delete(`/platform/domains/${id}`)
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Domains</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Custom domains mapped to tenants.</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />Add Domain
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="flex flex-col gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Tenant</label>
              <select required value={form.tenantId} onChange={(e) => setForm((f) => ({ ...f, tenantId: e.target.value }))}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select tenant</option>
                {tenants.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.slug})</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Domain</label>
              <input required value={form.domain} onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                placeholder="company.opsaura.io"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowAdd(false)}
              className="h-8 px-3 rounded-md border border-border text-xs text-muted-foreground">Cancel</button>
            <button type="submit" disabled={saving}
              className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50">
              {saving ? "Adding…" : "Add Domain"}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead><TableHead>Tenant</TableHead>
              <TableHead>Verified</TableHead><TableHead>Added</TableHead><TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>}
            {!loading && domains.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No domains configured</p>
                </TableCell>
              </TableRow>
            )}
            {domains.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-mono font-medium">{d.domain}</TableCell>
                <TableCell>
                  <p className="text-sm">{d.tenant.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{d.tenant.slug}</p>
                </TableCell>
                <TableCell>
                  {d.verified
                    ? <div className="flex items-center gap-1 text-emerald-500 text-xs"><CheckCircle2 className="h-3.5 w-3.5" />Verified</div>
                    : <div className="flex items-center gap-1 text-amber-500 text-xs"><Clock className="h-3.5 w-3.5" />Pending</div>}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {!d.verified && (
                      <button onClick={() => handleVerify(d.id)} disabled={verifying === d.id}
                        className="text-xs text-primary hover:underline disabled:opacity-50">
                        {verifying === d.id ? "Verifying…" : "Mark verified"}
                      </button>
                    )}
                    <button onClick={() => handleDelete(d.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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
