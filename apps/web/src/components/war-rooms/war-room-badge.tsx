import { Badge } from "@/components/ui/badge"
import type { WarRoomStatus } from "@/store/war-room-store"

const statusMap: Record<WarRoomStatus, { variant: "destructive" | "success" | "secondary"; label: string }> = {
  active:   { variant: "destructive", label: "Active" },
  resolved: { variant: "success",     label: "Resolved" },
  archived: { variant: "secondary",   label: "Archived" },
}

export function WarRoomStatusBadge({ status }: { status: WarRoomStatus }) {
  const { variant, label } = statusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}
