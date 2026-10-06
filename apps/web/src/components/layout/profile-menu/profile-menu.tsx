"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  KeyRound,
  Monitor,
  Settings2,
  LogOut,
  Key,
  ChevronDown,
} from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MOCK_USER = {
  name: "Ravi Reddy",
  email: "ravi.reddy@tessell.com",
  role: "Tenant Admin",
  avatarUrl: "",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function ProfileMenu() {
  const router = useRouter()
  const { logout, user } = useAuthStore()
  const displayUser = user ?? MOCK_USER
  const initials = getInitials(displayUser.name)

  function handleLogout() {
    logout()
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent transition-colors outline-none">
          <Avatar className="h-7 w-7">
            <AvatarImage src={displayUser.avatarUrl} alt={displayUser.name} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-xs font-medium text-foreground leading-none">{displayUser.name}</span>
            <span className="text-[10px] text-muted-foreground leading-none mt-0.5">{displayUser.role}</span>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="py-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">{displayUser.name}</span>
            <span className="text-xs text-muted-foreground font-normal">{displayUser.email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="h-4 w-4" />
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/password">
              <KeyRound className="h-4 w-4" />
              Change Password
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/api-keys">
              <Key className="h-4 w-4" />
              API Keys
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/sessions">
              <Monitor className="h-4 w-4" />
              Sessions
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/preferences">
              <Settings2 className="h-4 w-4" />
              Preferences
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
