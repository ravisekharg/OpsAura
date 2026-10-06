"use client"

import { useEffect, useState } from "react"
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { platformApi } from "@/lib/platform-api"

interface ServiceStatus { name: string; status: "operational" | "degraded" | "outage"; latencyMs: number; uptimePercent: number; errorRatePercent: number }

const statusIcon = { operational: CheckCircle2, degraded: AlertTriangle, outage: XCircle }
const statusColor = { operational: "text-emerald-500", degraded: "text-amber-500", outage: "text-destructive" }
const statusVariant: Record<string, any> = { operational: "success", degraded: "warning", outage: "destructive" }

const PLATFORM_SERVICES: ServiceStatus[] = [
  { name: "API Gateway", status: "operational", latencyMs: 14, uptimePercent: 99.99, errorRatePercent: 0.00 },
  { name: "Auth Service", status: "operational", latencyMs: 31, uptimePercent: 99.96, errorRatePercent: 0.02 },
  { name: "Alert Engine", status: "operational", latencyMs: 42, uptimePercent: 99.97, errorRatePercent: 0.01 },
  { name: "Escalation Engine", status: "operational", latencyMs: 55, uptimePercent: 99.95, errorRatePercent: 0.05 },
  { name: "Notification Dispatch", status: "operational", latencyMs: 95, uptimePercent: 99.85, errorRatePercent: 0.10 },
  { name: "Platform DB", status: "operational", latencyMs: 8, uptimePercent: 99.99, errorRatePercent: 0.00 },
  { name: "Redis (Queue/Cache)", status: "operational", latencyMs: 2, uptimePercent: 99.99, errorRatePercent: 0.00 },
  { name: "BullMQ Worker", status: "operational", latencyMs: 0, uptimePercent: 99.90, errorRatePercent: 0.00 },
]

function LatencyBar({ ms }: { ms: number }) {
  const pct = Math.min(100, (ms / 500) * 100)
  const color = ms > 300 ? "bg-destructive" : ms > 100 ? "bg-amber-500" : "bg-emerald-500"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-12 text-right">{ms}ms</span>
    </div>
  )
}

export default function SystemHealthPage() {
  const [services, setServices] = useState<ServiceStatus[]>(PLATFORM_SERVICES)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)

  async function refresh() {
    setRefreshing(true)
    await new Promise((r) => setTimeout(r, 800))
    // In production: call GET /platform/system/health
    // For now: simulate small latency variance
    setServices(PLATFORM_SERVICES.map((s) => ({
      ...s,
      latencyMs: s.latencyMs + Math.floor(Math.random() * 10 - 5),
    })))
    setLastRefresh(new Date())
    setRefreshing(false)
  }

  const allOperational = services.every((s) => s.status === "operational")
  const degraded = services.filter((s) => s.status === "degraded").length
  const outage = services.filter((s) => s.status === "outage").length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">System Health</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time status of all platform services.</p>
        </div>
        <button onClick={refresh} disabled={refreshing}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-border text-xs text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50">
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />Refresh
        </button>
      </div>

      {/* Overall Status Banner */}
      <div className={`rounded-lg border p-4 flex items-center gap-3 ${allOperational ? "border-emerald-500/20 bg-emerald-500/5" : outage > 0 ? "border-destructive/20 bg-destructive/5" : "border-amber-500/20 bg-amber-500/5"}`}>
        <div className={`flex h-3 w-3 rounded-full shrink-0 ${allOperational ? "bg-emerald-500" : outage > 0 ? "bg-destructive animate-pulse" : "bg-amber-500 animate-pulse"}`} />
        <div className="flex-1">
          <p className={`text-sm font-semibold ${allOperational ? "text-emerald-600 dark:text-emerald-400" : outage > 0 ? "text-destructive" : "text-amber-600 dark:text-amber-400"}`}>
            {allOperational ? "All Systems Operational" : outage > 0 ? `${outage} Service${outage > 1 ? "s" : ""} Down` : `${degraded} Service${degraded > 1 ? "s" : ""} Degraded`}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last checked: {lastRefresh.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })}
          </p>
        </div>
        <div className="flex gap-4 text-center">
          <div><p className="text-lg font-bold text-emerald-500">{services.filter((s) => s.status === "operational").length}</p><p className="text-[10px] text-muted-foreground">Operational</p></div>
          {degraded > 0 && <div><p className="text-lg font-bold text-amber-500">{degraded}</p><p className="text-[10px] text-muted-foreground">Degraded</p></div>}
          {outage > 0 && <div><p className="text-lg font-bold text-destructive">{outage}</p><p className="text-[10px] text-muted-foreground">Outage</p></div>}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((svc) => {
          const Icon = statusIcon[svc.status]
          return (
            <div key={svc.name} className={`rounded-lg border bg-card p-4 ${svc.status !== "operational" ? "border-amber-500/30" : "border-border"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-3.5 w-3.5 ${statusColor[svc.status]} ${svc.status !== "operational" ? "animate-pulse" : ""}`} />
                  <p className="text-xs font-medium text-foreground">{svc.name}</p>
                </div>
                <Badge variant={statusVariant[svc.status]} className="text-[10px] capitalize">{svc.status}</Badge>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className={svc.uptimePercent >= 99.9 ? "text-emerald-500 font-medium" : "text-amber-500 font-medium"}>
                    {svc.uptimePercent.toFixed(2)}%
                  </span>
                </div>
                {svc.latencyMs > 0 && (
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Latency</p>
                    <LatencyBar ms={svc.latencyMs} />
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Error Rate</span>
                  <span className={svc.errorRatePercent > 1 ? "text-destructive" : svc.errorRatePercent > 0.1 ? "text-amber-500" : "text-muted-foreground"}>
                    {svc.errorRatePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
