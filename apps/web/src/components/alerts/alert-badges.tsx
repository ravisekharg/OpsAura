import { Badge } from "@/components/ui/badge"
import type { AlertSeverity, AlertStatus } from "@/store/alert-store"

const severityMap: Record<AlertSeverity, { variant: "destructive" | "warning" | "secondary" | "outline" | "default"; label: string }> = {
  critical: { variant: "destructive", label: "Critical" },
  high:     { variant: "warning",     label: "High" },
  medium:   { variant: "secondary",   label: "Medium" },
  low:      { variant: "outline",     label: "Low" },
  info:     { variant: "default",     label: "Info" },
}

const statusMap: Record<AlertStatus, { variant: "destructive" | "warning" | "success" | "secondary"; label: string }> = {
  firing:       { variant: "destructive", label: "Firing" },
  acknowledged: { variant: "warning",     label: "Acknowledged" },
  resolved:     { variant: "success",     label: "Resolved" },
  suppressed:   { variant: "secondary",   label: "Suppressed" },
}

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const { variant, label } = severityMap[severity]
  return <Badge variant={variant}>{label}</Badge>
}

export function StatusBadge({ status }: { status: AlertStatus }) {
  const { variant, label } = statusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}
