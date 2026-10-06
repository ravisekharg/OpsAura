"use client"

import { useState } from "react"
import { Plus, ToggleLeft, ToggleRight } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useServiceNowStore } from "@/store/servicenow-store"
import { useAssignmentStore } from "@/store/assignment-store"

const syncStatusVariant: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
  synced: "success", failed: "destructive", partial: "warning", pending: "secondary",
}

function fmt(date?: Date) {
  if (!date) return "Never"
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })
}

export function AssignmentGroupsMapping() {
  const { connections, assignmentGroups, addAssignmentGroupMapping, toggleAutoSync } = useServiceNowStore()
  const localGroups = useAssignmentStore((s) => s.groups)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [connId, setConnId] = useState("")
  const [snGroupId, setSnGroupId] = useState("")
  const [snGroupName, setSnGroupName] = useState("")
  const [localGroupId, setLocalGroupId] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const local = localGroups.find((g) => g.id === localGroupId)
    addAssignmentGroupMapping({
      connectionId: connId, snGroupId, snGroupName,
      localGroupId, localGroupName: local?.name ?? "",
      autoSync: true, syncStatus: "pending",
    })
    setConnId(""); setSnGroupId(""); setSnGroupName(""); setLocalGroupId("")
    setDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Map ServiceNow assignment groups to OpsAura assignment groups for automatic alert routing.</p>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />Add Mapping
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Connection</TableHead>
              <TableHead>ServiceNow Group</TableHead>
              <TableHead>OpsAura Group</TableHead>
              <TableHead>Auto Sync</TableHead>
              <TableHead>Last Synced</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignmentGroups.map((g) => {
              const conn = connections.find((c) => c.id === g.connectionId)
              return (
                <TableRow key={g.id}>
                  <TableCell className="text-muted-foreground text-xs">{conn?.name ?? "—"}</TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{g.snGroupName}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{g.snGroupId}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{g.localGroupName}</Badge>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleAutoSync(g.id)} className="flex items-center gap-1.5 text-xs">
                      {g.autoSync
                        ? <><ToggleRight className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">On</span></>
                        : <><ToggleLeft className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Off</span></>}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{fmt(g.lastSyncedAt)}</TableCell>
                  <TableCell>
                    <Badge variant={syncStatusVariant[g.syncStatus]} className="capitalize">{g.syncStatus}</Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && setDialogOpen(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Assignment Group Mapping</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Connection</label>
              <Select value={connId} onValueChange={setConnId}>
                <SelectTrigger><SelectValue placeholder="Select connection" /></SelectTrigger>
                <SelectContent>{connections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">SN Group ID</label>
                <Input required value={snGroupId} onChange={(e) => setSnGroupId(e.target.value)} placeholder="SNG001" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">SN Group Name</label>
                <Input required value={snGroupName} onChange={(e) => setSnGroupName(e.target.value)} placeholder="Platform Engineering" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">OpsAura Assignment Group</label>
              <Select value={localGroupId} onValueChange={setLocalGroupId}>
                <SelectTrigger><SelectValue placeholder="Select local group" /></SelectTrigger>
                <SelectContent>{localGroups.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add Mapping</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
