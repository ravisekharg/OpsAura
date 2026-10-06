"use client"

import { useState } from "react"
import { Plus, ChevronDown, ChevronRight } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEscalationStore } from "@/store/escalation-store"
import { PolicyDialog } from "./policy-dialog"

export function PoliciesTable() {
  const policies = useEscalationStore((s) => s.policies)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />New Policy
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Policy</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Repeat</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((p) => (
              <>
                <TableRow key={p.id} className="cursor-pointer" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                  <TableCell>
                    {expanded === p.id ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{p.name}</p>
                    {p.description && <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.team}</TableCell>
                  <TableCell><Badge variant="secondary">{p.steps.length} steps</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.repeatCount}×</TableCell>
                  <TableCell><Badge variant={p.active ? "success" : "secondary"}>{p.active ? "Active" : "Inactive"}</Badge></TableCell>
                </TableRow>
                {expanded === p.id && (
                  <TableRow key={`${p.id}-steps`}>
                    <TableCell colSpan={6} className="bg-muted/20 p-0">
                      <div className="px-8 py-3 flex flex-col gap-2">
                        {p.steps.map((step) => (
                          <div key={step.order} className="flex items-center gap-3 text-xs">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0">{step.order}</span>
                            <span className="text-muted-foreground">After <span className="text-foreground font-medium">{step.delayMinutes}m</span></span>
                            <span className="text-muted-foreground">if <span className="text-foreground font-medium">{step.condition.replace("_", " ")}</span></span>
                            <span className="text-muted-foreground">→ notify <span className="text-foreground font-medium capitalize">{step.type.replace("_", " ")}</span>: <span className="text-primary">{step.target}</span></span>
                            <div className="flex gap-1 ml-auto">
                              {step.notifyChannels.map((ch) => <Badge key={ch} variant="outline" className="text-[10px]">{ch}</Badge>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
      <PolicyDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}
