"use client"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useServiceNowStore } from "@/store/servicenow-store"

const statusVariant: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
  synced: "success", failed: "destructive", partial: "warning", pending: "secondary",
}

const opLabel: Record<string, string> = {
  pull_groups: "Pull Groups",
  push_alert: "Push Alert",
  push_incident: "Push Incident",
  sync_users: "Sync Users",
}

function fmt(date: Date) {
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })
}

export function SyncLogsTable() {
  const syncLogs = useServiceNowStore((s) => s.syncLogs)
  const sorted = [...syncLogs].sort((a, b) => b.executedAt.getTime() - a.executedAt.getTime())

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Connection</TableHead>
            <TableHead>Operation</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Records</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Executed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 && (
            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-10">No sync logs</TableCell></TableRow>
          )}
          {sorted.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="text-muted-foreground text-xs">{log.connectionName}</TableCell>
              <TableCell><Badge variant="outline" className="text-xs">{opLabel[log.operation] ?? log.operation}</Badge></TableCell>
              <TableCell><Badge variant={statusVariant[log.status]} className="capitalize">{log.status}</Badge></TableCell>
              <TableCell className="text-muted-foreground text-xs text-center">{log.recordsAffected}</TableCell>
              <TableCell>
                <p className="text-xs">{log.message}</p>
                {log.errorDetail && <p className="text-xs text-destructive mt-0.5">{log.errorDetail}</p>}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                {log.durationMs > 1000 ? `${(log.durationMs / 1000).toFixed(1)}s` : `${log.durationMs}ms`}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{fmt(log.executedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
