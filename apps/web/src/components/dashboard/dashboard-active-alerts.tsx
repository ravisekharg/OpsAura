"use client"

import Link from "next/link"
import { ArrowRight, CheckCheck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAlertStore } from "@/store/alert-store"
import { useAuthStore } from "@/store/auth-store"
import { SeverityBadge, StatusBadge } from "@/components/alerts/alert-badges"

function timeAgo(date: Date) {
  const m = Math.floor((Date.now() - date.getTime()) / 60000)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

export function DashboardActiveAlerts() {
  const { alerts, acknowledge, resolve } = useAlertStore()
  const user = useAuthStore((s) => s.user)

  const active = alerts
    .filter((a) => a.status === "firing" || a.status === "acknowledged")
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }
      return order[a.severity] - order[b.severity]
    })
    .slice(0, 5)

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Active Alerts</h2>
        <Link href="/alerts/active" className="flex items-center gap-1 text-xs text-primary hover:underline">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {active.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <p className="text-sm">No active alerts</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {active.map((alert) => (
            <div key={alert.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <SeverityBadge severity={alert.severity} />
                  <StatusBadge status={alert.status} />
                </div>
                <p className="mt-1 text-sm font-medium text-foreground leading-snug line-clamp-1">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.service} · {timeAgo(alert.firedAt)}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {alert.status === "firing" && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => acknowledge(alert.id, user?.name ?? "Unknown")}>
                    <CheckCheck className="h-3 w-3 mr-1" />ACK
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="h-7 text-xs text-emerald-500 hover:text-emerald-600" onClick={() => resolve(alert.id)}>
                  <CheckCircle2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
