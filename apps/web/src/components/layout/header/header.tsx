import { Zap } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { EnvBadge } from "./env-badge"
import { LiveClock } from "./live-clock"
import { ThemeToggle } from "../theme-toggle"
import { NotificationDrawer } from "../notification-drawer/notification-drawer"
import { ProfileMenu } from "../profile-menu/profile-menu"

export function Header() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "OpsAura"

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 shrink-0">
      <div className="flex items-center gap-2 mr-2">
        <span className="text-sm font-semibold text-foreground">{appName}</span>
        <EnvBadge />
      </div>

      <Separator orientation="vertical" className="h-5" />

      <LiveClock />

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationDrawer />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <ProfileMenu />
      </div>
    </header>
  )
}
