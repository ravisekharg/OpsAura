"use client"

import { useAuditStore } from "@/store/audit-store"

export function AuditStats() {
  const events = useAuditStore((s) => s.events)

  const last24h = events.filter((e) => Date.now() - e.createdAt.getTime() < 86400000)
  const warnings = last24h.filter((e) => e.severity === "warning" || e.severity === "critical")
  const authEvents = last24h.filter((e) => e.category === "auth")
  const systemEvents = last24h.filter((e) => e.actor === "System")

  const stats = [
    { label: "Events (24h)", value: last24h.length },
    { label: "Warnings (24h)", value: warnings.length },
    { label: "Auth Events (24h)", value: authEvents.length },
    { label: "System Events (24h)", value: systemEvents.length },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">{s.label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{s.value}</p>
        </div>
      ))}
    </div>
  )
}
