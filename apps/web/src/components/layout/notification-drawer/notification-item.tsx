import Link from "next/link"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AppNotification, NotificationSeverity } from "@/store/notification-store"

const severityConfig: Record<
  NotificationSeverity,
  { icon: React.ElementType; color: string }
> = {
  critical: { icon: AlertCircle, color: "text-red-500" },
  warning: { icon: AlertTriangle, color: "text-amber-500" },
  info: { icon: Info, color: "text-sky-500" },
  success: { icon: CheckCircle2, color: "text-emerald-500" },
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

interface NotificationItemProps {
  notification: AppNotification
  onRead: (id: string) => void
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const { icon: Icon, color } = severityConfig[notification.severity]

  const content = (
    <div
      className={cn(
        "flex gap-3 rounded-lg p-3 transition-colors cursor-pointer",
        notification.read
          ? "hover:bg-muted/50"
          : "bg-primary/5 hover:bg-primary/10"
      )}
      onClick={() => !notification.read && onRead(notification.id)}
    >
      <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", color)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm leading-snug", notification.read ? "text-muted-foreground" : "text-foreground font-medium")}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
        <p className="mt-1 text-[10px] text-muted-foreground/60">{timeAgo(notification.createdAt)}</p>
      </div>
    </div>
  )

  if (notification.href) {
    return <Link href={notification.href}>{content}</Link>
  }

  return content
}
