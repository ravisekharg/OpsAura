"use client"

import { useState } from "react"
import { Plus, ToggleLeft, ToggleRight } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAlertStore } from "@/store/alert-store"
import { CorrelationRuleDialog } from "./correlation-rule-dialog"

export function CorrelationRulesTable() {
  const { correlationRules, toggleCorrelationRule } = useAlertStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Group related alerts firing within a time window into a single incident.</p>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />New Rule
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule</TableHead>
              <TableHead>Match Field</TableHead>
              <TableHead>Match Value</TableHead>
              <TableHead>Group By</TableHead>
              <TableHead>Window</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {correlationRules.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <p className="font-medium">{r.name}</p>
                  {r.description && <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>}
                </TableCell>
                <TableCell><Badge variant="outline" className="text-xs font-mono">{r.matchField}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-xs">{r.matchValue}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{r.groupBy}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-xs">{r.windowMinutes}m</TableCell>
                <TableCell>
                  <button onClick={() => toggleCorrelationRule(r.id)} className="flex items-center gap-1.5 text-xs">
                    {r.active
                      ? <><ToggleRight className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">Active</span></>
                      : <><ToggleLeft className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Inactive</span></>}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CorrelationRuleDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}
