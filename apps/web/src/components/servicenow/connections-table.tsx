"use client"

import { useState } from "react"
import { Plus, RefreshCw, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useServiceNowStore } from "@/store/servicenow-store"
import { ConnectionDialog } from "./connection-dialog"

function fmt(date?: Date) {
  if (!date) return "Never"
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })
}

export function ConnectionsTable() {
  const { connections, testConnection, triggerSync } = useServiceNowStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)

  async function handleTest(id: string) {
    setTesting(id)
    await testConnection(id)
    setTesting(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />Add Connection
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Instance URL</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Tested</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs font-mono">{c.instanceUrl}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{c.username}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {c.status === "connected" && <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /><Badge variant="success">Connected</Badge></>}
                    {c.status === "disconnected" && <><XCircle className="h-3.5 w-3.5 text-destructive" /><Badge variant="destructive">Disconnected</Badge></>}
                    {c.status === "testing" && <><Loader2 className="h-3.5 w-3.5 text-primary animate-spin" /><Badge variant="secondary">Testing…</Badge></>}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{fmt(c.lastTestedAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs" disabled={testing === c.id} onClick={() => handleTest(c.id)}>
                      {testing === c.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                      Test
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => triggerSync(c.id)}>
                      Sync Now
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ConnectionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}
