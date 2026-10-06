"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Reset Password</h1>
        <p className="text-sm text-muted-foreground">We'll send a reset link to your email</p>
      </div>

      {sent ? (
        <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400 text-center">
          Check your inbox for the reset link.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button type="submit" className="w-full">Send Reset Link</Button>
        </form>
      )}

      <div className="mt-6 flex justify-center">
        <Link href="/login" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Back to sign in
        </Link>
      </div>
    </div>
  )
}
