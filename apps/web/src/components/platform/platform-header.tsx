"use client"

import { useRouter } from "next/navigation"
import { LogOut, ChevronDown, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LiveClock } from "@/components/layout/header/live-clock"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { clearPlatformSession, type PlatformUser } from "@/lib/platform-session"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PlatformHeaderProps {
  user: PlatformUser
}

export function PlatformHeader({ user }: PlatformHeaderProps) {
  const router = useRouter()
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()

  function handleLogout() {
    clearPlatformSession()
    window.location.href = "/platform/login"
  }

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">OpsAura</span>
        <Badge variant="dev" className="gap-1">
          <Shield className="h-2.5 w-2.5" />
          PLATFORM
        </Badge>
      </div>

      <div className="flex-1" />

      <LiveClock />
      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent transition-colors">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs bg-amber-500 text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-xs font-medium text-foreground leading-none">{user.name}</span>
              <span className="text-[10px] text-amber-500 font-semibold capitalize leading-none mt-0.5">
                {user.role.replace(/_/g, " ")}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" />Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
