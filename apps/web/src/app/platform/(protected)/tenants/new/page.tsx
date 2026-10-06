"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Loader2, Copy, Check, Database, Users, Settings, Key } from "lucide-react"
import { platformApi } from "@/lib/platform-api"

interface Plan { id: string; name: string; priceMonthly: number }

interface ProvisionResult {
  tenantId: string; slug: string; name: string; adminEmail: string; dbName: string; message: string
}

const STEPS = [
  { icon: Database, label: "Create database" },
  { icon: Settings, label: "Run migrations" },
  { icon: Users, label: "Seed roles & permissions" },
  { icon: Key, label: "Create tenant admin" },
]

export default function ProvisionTenantPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [result, setResult] = useState<ProvisionResult | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ slug: "", name: "", adminEmail: "", adminName: "", domain: "", planId: "" })

  useEffect(() => {
    platformApi.get<{ data: Plan[] }>("/platform/plans")
      .then((r) => setPlans(r.data))
      .catch(console.error)
  }, [])

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
    if (k === "name" && !form.slug) {
      const slug = v.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "")
      setForm((f) => ({ ...f, slug }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setCurrentStep(0)

    // Simulate step progression while waiting for API
    const stepInterval = setInterval(() => {
      setCurrentStep((s) => (s < STEPS.length - 1 ? s + 1 : s))
    }, 3000)

    try {
      const res = await platformApi.post<{ data: ProvisionResult }>("/platform/tenants", form)
      clearInterval(stepInterval)
      setCurrentStep(STEPS.length)
      setResult(res.data)
    } catch (err) {
      clearInterval(stepInterval)
      setError((err as Error).message)
      setCurrentStep(-1)
    } finally {
      setLoading(false)
    }
  }

  function copyInfo() {
    if (!result) return
    navigator.clipboard.writeText(`Tenant: ${result.slug}\nAdmin Email: ${result.adminEmail}\nDatabase: ${result.dbName}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link href="/platform/tenants" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Provision New Tenant</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Creates a dedicated database, runs migrations, seeds roles, and creates admin.</p>
        </div>
      </div>

      {result ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-semibold text-foreground">Tenant provisioned successfully</h2>
          </div>
          <div className="rounded-md bg-background border border-border p-3 flex flex-col gap-2 text-sm font-mono">
            <div className="flex justify-between"><span className="text-muted-foreground">Tenant</span><span>{result.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Slug</span><span>{result.slug}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Database</span><span>{result.dbName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Admin Email</span><span>{result.adminEmail}</span></div>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-md">
            ⚠ The temporary password has been logged server-side (DEV mode). In production it will be sent via email.
          </p>
          <div className="flex gap-2">
            <button onClick={copyInfo}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-border text-xs text-foreground hover:bg-muted transition-colors">
              {copied ? <><Check className="h-3.5 w-3.5 text-emerald-500" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy info</>}
            </button>
            <Link href="/platform/tenants"
              className="flex items-center h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
              View all tenants →
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Company Name</label>
                <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="Acme Technologies"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Slug <span className="text-muted-foreground">(auto-generated)</span></label>
                <input required value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  placeholder="acme"
                  pattern="[a-z0-9_-]+"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Admin Full Name</label>
                <input required value={form.adminName} onChange={(e) => set("adminName", e.target.value)}
                  placeholder="Jane Smith"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Admin Email</label>
                <input required type="email" value={form.adminEmail} onChange={(e) => set("adminEmail", e.target.value)}
                  placeholder="admin@acme.com"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Domain <span className="text-muted-foreground">(optional)</span></label>
                <input value={form.domain} onChange={(e) => set("domain", e.target.value)}
                  placeholder="acme.com"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Plan <span className="text-muted-foreground">(optional)</span></label>
                <select value={form.planId} onChange={(e) => set("planId", e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Default (Starter)</option>
                  {plans.map((p) => <option key={p.id} value={p.id}>{p.name} — ${p.priceMonthly}/mo</option>)}
                </select>
              </div>
            </div>

            {/* Steps preview */}
            <div className="rounded-md bg-muted/30 border border-border p-3">
              <p className="text-xs font-medium text-foreground mb-2">Provisioning will execute:</p>
              <div className="flex flex-col gap-1.5">
                {STEPS.map((step, i) => {
                  const Icon = step.icon
                  const done = loading && currentStep > i
                  const active = loading && currentStep === i
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full shrink-0 ${done ? "bg-emerald-500" : active ? "bg-primary" : "bg-muted"}`}>
                        {done ? <Check className="h-3 w-3 text-white" /> :
                          active ? <Loader2 className="h-3 w-3 text-white animate-spin" /> :
                            <Icon className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <span className={done ? "text-emerald-500" : active ? "text-primary font-medium" : "text-muted-foreground"}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="h-9 w-full rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Provisioning… (30–60s)</> : "Provision Tenant"}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
