import { Badge } from "@/components/ui/badge"
import type { EscalationStatus, EscalationPriority } from "@/store/escalation-store"

const statusMap: Record<EscalationStatus, { variant: "destructive" | "warning" | "success" | "secondary"; label: string }> = {
  open:         { variant: "destructive", label: "Open" },
  escalated:    { variant: "warning",     label: "Escalated" },
  acknowledged: { variant: "secondary",   label: "Acknowledged" },
  resolved:     { variant: "success",     label: "Resolved" },
}

const priorityMap: Record<EscalationPriority, { variant: "destructive" | "warning" | "secondary" | "outline" }> = {
  P0: { variant: "destructive" },
  P1: { variant: "warning" },
  P2: { variant: "secondary" },
  P3: { variant: "outline" },
}

export function EscalationStatusBadge({ status }: { status: EscalationStatus }) {
  const { variant, label } = statusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function EscalationPriorityBadge({ priority }: { priority: EscalationPriority }) {
  return <Badge variant={priorityMap[priority].variant}>{priority}</Badge>
}
