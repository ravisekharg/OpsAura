import { PlatformSidebar } from "./platform-sidebar"
import { PlatformHeader } from "./platform-header"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PlatformUser } from "@/lib/platform-session"

interface PlatformShellProps {
  user: PlatformUser
  children: React.ReactNode
}

export function PlatformShell({ user, children }: PlatformShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <PlatformSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <PlatformHeader user={user} />
        <ScrollArea className="flex-1">
          <main className="p-6">{children}</main>
        </ScrollArea>
      </div>
    </div>
  )
}
