"use client"

import { useEffect, useState } from "react"
import { Plus, Search, ToggleLeft, ToggleRight, Loader2 } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAssignmentStore } from "@/store/assignment-store"
import { AssignmentGroupDialog } from "./assignment-group-dialog"

export function AssignmentGroupsTable() {
  const { groups, isLoading, toggleGroup, fetchGroups } = useAssignmentStore()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => { fetchGroups() }, [fetchGroups])

  const filtered = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.team?.name ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search groups…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />New Group
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>OnCall Policy</TableHead>
              <TableHead>Escalation Policy</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && groups.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">No assignment groups</TableCell></TableRow>
            )}
            {filtered.map((g) => (
              <TableRow key={g.id}>
                <TableCell>
                  <p className="font-medium">{g.name}</p>
                  {g.description && <p className="text-xs text-muted-foreground mt-0.5">{g.description}</p>}
                </TableCell>
                <TableCell className="text-muted-foreground">{g.team?.name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{g.oncallPolicy ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{g.escalationPolicy?.name ?? "—"}</TableCell>
                <TableCell>
                  <button onClick={() => toggleGroup(g.id)} className="flex items-center gap-1.5 text-xs">
                    {g.active
                      ? <><ToggleRight className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">Active</span></>
                      : <><ToggleLeft className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Inactive</span></>}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AssignmentGroupDialog open={dialogOpen} onClose={() => { setDialogOpen(false); fetchGroups() }} />
    </div>
  )
}
