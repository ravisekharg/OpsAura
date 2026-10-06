"use client"

import { useState } from "react"
import { Plus, CheckCheck, CheckCircle2 } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEscalationStore, type EscalationType } from "@/store/escalation-store"
import { useAuthStore } from "@/store/auth-store"
import { EscalationStatusBadge, EscalationPriorityBadge } from "./escalation-badges"
import { EscalationDialog } from "./escalation-dialog"

function timeAgo(date: Date) {
  const m = Math.floor((Date.now() - date.getTime()) / 60000)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

interface Props { type: EscalationType }

export function EscalationsTable({ type }: Props) {
  const { escalations, acknowledgeEscalation, updateEscalationStatus } = useEscalationStore()
  const user = useAuthStore((s) => s.user)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filtered = escalations.filter((e) => e.type === type)
  const label = type === "customer" ? "Customer" : "Vendor"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />Raise {label} Escalation
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Escalation</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead>Step</TableHead>
              <TableHead>Opened</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-10">No {label.toLowerCase()} escalations</TableCell></TableRow>
            )}
            {filtered.map((esc) => (
              <TableRow key={esc.id}>
                <TableCell>
                  <p className="font-medium leading-none">{esc.title}</p>
                  {esc.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{esc.description}</p>}
                </TableCell>
                <TableCell><EscalationPriorityBadge priority={esc.priority} /></TableCell>
                <TableCell><EscalationStatusBadge status={esc.status} /></TableCell>
                <TableCell className="text-muted-foreground text-xs">{esc.service || "—"}</TableCell>
                <TableCell>
                  <p className="text-xs font-medium">{esc.contactName || "—"}</p>
                  {esc.contactCompany && <p className="text-[10px] text-muted-foreground">{esc.contactCompany}</p>}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{esc.policyName || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">Step {esc.currentStep}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{timeAgo(esc.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {esc.status === "open" || esc.status === "escalated" ? (
                      <>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => acknowledgeEscalation(esc.id, user?.name ?? "Unknown")}>
                          <CheckCheck className="h-3 w-3 mr-1" />ACK
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-emerald-500 hover:text-emerald-600" onClick={() => updateEscalationStatus(esc.id, "resolved")}>
                          <CheckCircle2 className="h-3 w-3 mr-1" />Resolve
                        </Button>
                      </>
                    ) : esc.status === "acknowledged" ? (
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-emerald-500 hover:text-emerald-600" onClick={() => updateEscalationStatus(esc.id, "resolved")}>
                        <CheckCircle2 className="h-3 w-3 mr-1" />Resolve
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EscalationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} type={type} />
    </div>
  )
}
