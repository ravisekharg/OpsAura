import type { Metadata } from "next"
import { AlertHistoryTable } from "@/components/alerts/alert-history-table"

export const metadata: Metadata = { title: "Alert History — OpsAura" }

export default function AlertHistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Alert History</h1>
        <p className="text-sm text-muted-foreground mt-1">Resolved and suppressed alerts.</p>
      </div>
      <AlertHistoryTable />
    </div>
  )
}
