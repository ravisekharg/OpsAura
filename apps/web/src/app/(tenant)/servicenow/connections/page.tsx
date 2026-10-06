import type { Metadata } from "next"
import { ConnectionsTable } from "@/components/servicenow/connections-table"

export const metadata: Metadata = { title: "ServiceNow Connections — OpsAura" }

export default function ServiceNowConnectionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">ServiceNow Connections</h1>
        <p className="text-sm text-muted-foreground mt-1">Connect OpsAura to one or more ServiceNow instances.</p>
      </div>
      <ConnectionsTable />
    </div>
  )
}
