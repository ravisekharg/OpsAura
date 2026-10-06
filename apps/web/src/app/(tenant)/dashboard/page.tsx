import type { Metadata } from "next"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardActiveAlerts } from "@/components/dashboard/dashboard-active-alerts"
import { DashboardWarRooms } from "@/components/dashboard/dashboard-war-rooms"
import { DashboardRecentActivity } from "@/components/dashboard/dashboard-recent-activity"

export const metadata: Metadata = { title: "Dashboard — OpsAura" }

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Live overview of alerts, on-call, war rooms, and escalations.</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardActiveAlerts />
        <DashboardWarRooms />
      </div>

      <DashboardRecentActivity />
    </div>
  )
}
