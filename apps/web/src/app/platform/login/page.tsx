"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Zap, Shield } from "lucide-react"
import { setPlatformSession } from "@/lib/platform-session"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4100/v1"

export default function PlatformLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API}/platform/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.message ?? "Invalid credentials")
        return
      }

      const { accessToken, user } = json.data ?? json

      // Store session synchronously — no hydration gap
      setPlatformSession(accessToken, user)

      // Hard navigate so middleware cookie is picked up
      window.location.href = "/platform/dashboard"
    } catch {
      setError("Cannot connect to server. Check that the API is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-6 w-6 text-primary-foreground" />
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 border-2 border-background">
              <Shield className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-foreground">OpsAura</h1>
          <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 rounded-full">
            Platform Administration
          </span>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Restricted access · Platform admins only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@opsaura.io"
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-9 w-full rounded-md border border-input bg-background px-3 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-9 w-full rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
          >
            {loading ? "Signing in…" : "Sign in to Platform"}
          </button>
        </form>

        {/* Credentials hint */}
        <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1.5">Demo credentials</p>
          <p className="text-xs font-mono text-foreground">platform@opsaura.io</p>
          <p className="text-xs font-mono text-foreground">PlatAdmin@123</p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Tenant login?{" "}
          <a href="/login" className="text-primary hover:underline">
            Go to tenant portal →
          </a>
        </p>
      </div>
    </div>
  )
}
