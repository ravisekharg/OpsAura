"use client"

import { useSystemHealthStore, type ServiceStatus } from "@/store/system-health-store"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusColor: Record<ServiceStatus, string> = {
  operational: "bg-emerald-500",
  degraded: "bg-amber-500",
  outage: "bg-red-500",
  maintenance: "bg-blue-500",
}

const statusVariant: Record<ServiceStatus, "success" | "warning" | "destructive" | "secondary"> = {
  operational: "success", degraded: "warning", outage: "destructive", maintenance: "secondary",
}

function LatencyBar({ ms }: { ms: number }) {
  const pct = Math.min(100, (ms / 800) * 100)
  const color = ms > 500 ? "bg-red-500" : ms > 200 ? "bg-amber-500" : "bg-emerald-500"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-12 text-right">{ms}ms</span>
    </div>
  )
}

export function ServicesGrid() {
  const services = useSystemHealthStore((s) => s.services)
  const categories = [...new Set(services.map((s) => s.category))]

  return (
    <div className="flex flex-col gap-6">
      {categories.map((cat) => (
        <div key={cat}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{cat}</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.filter((s) => s.category === cat).map((svc) => (
              <div key={svc.id} className={cn("rounded-lg border bg-card p-4", svc.status !== "operational" && "border-amber-500/30")}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${statusColor[svc.status]} ${svc.status !== "operational" ? "animate-pulse" : ""}`} />
                    <p className="text-sm font-medium text-foreground">{svc.name}</p>
                  </div>
                  <Badge variant={statusVariant[svc.status]} className="text-xs capitalize">{svc.status}</Badge>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className={cn("font-medium", svc.uptimePercent < 99 ? "text-amber-500" : "text-emerald-500")}>{svc.uptimePercent.toFixed(2)}%</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Latency</span>
                    <LatencyBar ms={svc.latencyMs} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Error Rate</span>
                    <span className={cn("font-medium", svc.errorRatePercent > 1 ? "text-red-500" : svc.errorRatePercent > 0.1 ? "text-amber-500" : "text-muted-foreground")}>
                      {svc.errorRatePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
