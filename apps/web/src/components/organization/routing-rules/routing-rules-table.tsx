"use client"

import { useEffect, useState } from "react"
import { Plus, ToggleLeft, ToggleRight, Loader2 } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAssignmentStore } from "@/store/assignment-store"
import { RoutingRuleDialog } from "./routing-rule-dialog"

export function RoutingRulesTable() {
  const { rules, isLoading, toggleRule, fetchRules } = useAssignmentStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => { fetchRules() }, [fetchRules])

  const sorted = [...rules].sort((a, b) => a.priority - b.priority)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Rules are evaluated top-down by priority. First match wins.</p>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />New Rule
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Rule</TableHead>
              <TableHead>Conditions</TableHead>
              <TableHead>Assign To</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && rules.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            )}
            {!isLoading && sorted.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">No routing rules</TableCell></TableRow>
            )}
            {sorted.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="text-muted-foreground font-mono text-xs">{rule.priority}</TableCell>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {rule.conditions.map((c, i) => (
                      <Badge key={i} variant="outline" className="text-xs font-mono">
                        {c.field} {c.operator} &quot;{c.value}&quot;
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{rule.assignmentGroup?.name ?? "—"}</Badge>
                </TableCell>
                <TableCell>
                  <button onClick={() => toggleRule(rule.id)} className="flex items-center gap-1.5 text-xs">
                    {rule.active
                      ? <><ToggleRight className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">Active</span></>
                      : <><ToggleLeft className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Inactive</span></>}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RoutingRuleDialog open={dialogOpen} onClose={() => { setDialogOpen(false); fetchRules() }} />
    </div>
  )
}
