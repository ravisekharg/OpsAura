"use client"

import { useState } from "react"
import { Plus, ToggleLeft, ToggleRight } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAlertStore } from "@/store/alert-store"
import { SuppressionRuleDialog } from "./suppression-rule-dialog"

function fmtDate(date?: Date) {
  if (!date) return "Never"
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true })
}

export function SuppressionRulesTable() {
  const { suppressionRules, toggleSuppressionRule } = useAlertStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Silence known or expected alerts during maintenance windows or known outages.</p>
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
              <TableHead>Reason</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppressionRules.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <p className="font-medium">{r.name}</p>
                  {r.description && <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>}
                </TableCell>
                <TableCell><Badge variant="outline" className="text-xs font-mono">{r.matchField}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-xs">{r.matchValue}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{r.reason}</TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{fmtDate(r.expiresAt)}</TableCell>
                <TableCell>
                  <button onClick={() => toggleSuppressionRule(r.id)} className="flex items-center gap-1.5 text-xs">
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
      <SuppressionRuleDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}
