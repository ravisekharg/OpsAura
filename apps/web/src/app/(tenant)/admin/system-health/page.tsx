import type { Metadata } from "next"
import { HealthOverview } from "@/components/system-health/health-overview"
import { IncidentsList } from "@/components/system-health/incidents-list"
import { ServicesGrid } from "@/components/system-health/services-grid"
import { MetricsSparklines } from "@/components/system-health/metrics-sparkline"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = { title: "System Health — OpsAura" }

export default function SystemHealthPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">System Health</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time status of all OpsAura services and integrations.</p>
      </div>

      <HealthOverview />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Active Incidents</h2>
        <IncidentsList />
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Services</h2>
        <ServicesGrid />
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Metrics (24h)</h2>
        <MetricsSparklines />
      </div>
    </div>
  )
}
