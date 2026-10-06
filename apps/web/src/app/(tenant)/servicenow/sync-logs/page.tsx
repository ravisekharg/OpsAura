import type { Metadata } from "next"
import { SyncLogsTable } from "@/components/servicenow/sync-logs-table"

export const metadata: Metadata = { title: "ServiceNow Sync Logs — OpsAura" }

export default function ServiceNowSyncLogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Sync Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Audit trail of all ServiceNow sync operations — pulls, pushes, and user syncs.</p>
      </div>
      <SyncLogsTable />
    </div>
  )
}
