"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSystemHealthStore, type ServiceStatus } from "@/store/system-health-store"

const statusColor: Record<ServiceStatus, string> = {
  operational: "bg-emerald-500",
  degraded: "bg-amber-500",
  outage: "bg-red-500",
  maintenance: "bg-blue-500",
}

const statusLabel: Record<ServiceStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
  maintenance: "Maintenance",
}

function overallStatus(services: ReturnType<typeof useSystemHealthStore.getState>["services"]): ServiceStatus {
  if (services.some((s) => s.status === "outage")) return "outage"
  if (services.some((s) => s.status === "degraded")) return "degraded"
  if (services.some((s) => s.status === "maintenance")) return "maintenance"
  return "operational"
}

export function HealthOverview() {
  const { services, refreshedAt, refresh } = useSystemHealthStore()
  const overall = overallStatus(services)

  const counts: Record<ServiceStatus, number> = { operational: 0, degraded: 0, outage: 0, maintenance: 0 }
  services.forEach((s) => counts[s.status]++)

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`flex h-3 w-3 rounded-full ${statusColor[overall]} ${overall !== "operational" ? "animate-pulse" : ""}`} />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {overall === "operational" ? "All Systems Operational" : `System Status: ${statusLabel[overall]}`}
            </p>
            <p className="text-xs text-muted-foreground">
              Last refreshed {refreshedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />Refresh
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.entries(counts) as [ServiceStatus, number][]).map(([status, count]) => (
          <div key={status} className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5">
            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${statusColor[status]}`} />
            <div>
              <p className="text-lg font-bold text-foreground leading-none">{count}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{statusLabel[status]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
