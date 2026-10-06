"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getPlatformUser, type PlatformUser } from "@/lib/platform-session"
import { PlatformShell } from "@/components/platform/platform-shell"

export default function ProtectedPlatformLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<PlatformUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // sessionStorage is synchronous — this reads instantly, no hydration delay
    const u = getPlatformUser()
    if (!u) {
      router.replace("/platform/login")
      return
    }
    setUser(u)
    setReady(true)
  }, [router])

  if (!ready || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <PlatformShell user={user}>{children}</PlatformShell>
}
