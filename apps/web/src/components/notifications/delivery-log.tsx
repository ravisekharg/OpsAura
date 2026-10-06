"use client"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useNotificationChannelStore, type ChannelType } from "@/store/notification-channel-store"

const statusVariant: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
  delivered: "success",
  sent: "warning",
  failed: "destructive",
  pending: "secondary",
}

const channelIcon: Record<ChannelType, string> = {
  email: "✉", slack: "🔔", teams: "💬", voice: "📞",
}

function fmt(date: Date) {
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })
}

interface Props { channelType?: ChannelType; limit?: number }

export function DeliveryLog({ channelType, limit }: Props) {
  const deliveries = useNotificationChannelStore((s) => s.deliveries)

  const filtered = deliveries
    .filter((d) => !channelType || d.channelType === channelType)
    .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
    .slice(0, limit ?? 100)

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {!channelType && <TableHead>Channel</TableHead>}
            <TableHead>Recipient</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 && (
            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">No delivery records</TableCell></TableRow>
          )}
          {filtered.map((d) => (
            <TableRow key={d.id}>
              {!channelType && (
                <TableCell>
                  <Badge variant="outline" className="text-xs capitalize gap-1">
                    <span>{channelIcon[d.channelType]}</span>{d.channelType}
                  </Badge>
                </TableCell>
              )}
              <TableCell className="text-muted-foreground text-xs font-mono">{d.recipient}</TableCell>
              <TableCell>
                <p className="text-sm leading-none">{d.subject}</p>
                {d.errorMessage && <p className="text-xs text-destructive mt-0.5">{d.errorMessage}</p>}
              </TableCell>
              <TableCell><Badge variant={statusVariant[d.status]} className="capitalize">{d.status}</Badge></TableCell>
              <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{fmt(d.sentAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
