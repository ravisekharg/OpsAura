import type { Metadata } from "next"
import { ActiveAlertsTable } from "@/components/alerts/active-alerts-table"

export const metadata: Metadata = { title: "Active Alerts — OpsAura" }

export default function ActiveAlertsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Active Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">Firing and acknowledged alerts requiring attention.</p>
      </div>
      <ActiveAlertsTable />
    </div>
  )
}
