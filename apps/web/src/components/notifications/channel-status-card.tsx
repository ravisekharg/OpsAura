import { CheckCircle2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { NotificationChannel } from "@/store/notification-channel-store"

interface Props {
  channel: NotificationChannel
  children: React.ReactNode
}

export function ChannelStatusCard({ channel, children }: Props) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{channel.name} Configuration</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last updated {channel.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {channel.connected
            ? <><CheckCircle2 className="h-4 w-4 text-emerald-500" /><Badge variant="success">Connected</Badge></>
            : <><XCircle className="h-4 w-4 text-destructive" /><Badge variant="destructive">Disconnected</Badge></>}
        </div>
      </div>
      {children}
    </div>
  )
}
