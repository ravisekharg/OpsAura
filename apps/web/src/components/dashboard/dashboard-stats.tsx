"use client"

import Link from "next/link"
import { Bell, Clock, Users, GitBranch } from "lucide-react"
import { useAlertStore } from "@/store/alert-store"
import { useWarRoomStore } from "@/store/war-room-store"
import { useEscalationStore } from "@/store/escalation-store"
import { useOnCallStore } from "@/store/oncall-store"

export function DashboardStats() {
  const alerts = useAlertStore((s) => s.alerts)
  const rooms = useWarRoomStore((s) => s.rooms)
  const escalations = useEscalationStore((s) => s.escalations)
  const { rotations, overrides } = useOnCallStore()

  const activeAlerts = alerts.filter((a) => a.status === "firing" || a.status === "acknowledged")
  const criticalAlerts = activeAlerts.filter((a) => a.severity === "critical")
  const openRooms = rooms.filter((r) => r.status === "active")
  const openEscalations = escalations.filter((e) => e.status === "open" || e.status === "escalated")

  const now = new Date()
  const currentOverride = overrides.find((o) => o.startAt <= now && o.endAt >= now)
  const currentRotation = rotations.find((r) => r.active)
  const oncallNow = currentOverride?.overrideUser ?? currentRotation?.members[0]?.name ?? "Unassigned"

  const stats = [
    {
      label: "Active Alerts",
      value: activeAlerts.length,
      sub: criticalAlerts.length > 0 ? `${criticalAlerts.length} critical` : "None critical",
      subColor: criticalAlerts.length > 0 ? "text-red-500" : "text-emerald-500",
      icon: Bell,
      iconBg: criticalAlerts.length > 0 ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary",
      href: "/alerts/active",
      pulse: criticalAlerts.length > 0,
    },
    {
      label: "OnCall Now",
      value: oncallNow,
      sub: currentOverride ? "Override active" : "Regular rotation",
      subColor: currentOverride ? "text-amber-500" : "text-muted-foreground",
      icon: Clock,
      iconBg: "bg-primary/10 text-primary",
      href: "/oncall/coverage",
      pulse: false,
    },
    {
      label: "Open War Rooms",
      value: openRooms.length,
      sub: openRooms.length > 0 ? openRooms.map((r) => r.title.slice(0, 30) + "…").join(", ").slice(0, 40) : "All clear",
      subColor: openRooms.length > 0 ? "text-amber-500" : "text-emerald-500",
      icon: Users,
      iconBg: openRooms.length > 0 ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary",
      href: "/war-rooms/active",
      pulse: openRooms.length > 0,
    },
    {
      label: "Pending Escalations",
      value: openEscalations.length,
      sub: openEscalations.length > 0 ? `${openEscalations.filter((e) => e.priority === "P0").length} P0` : "None pending",
      subColor: openEscalations.length > 0 ? "text-amber-500" : "text-emerald-500",
      icon: GitBranch,
      iconBg: openEscalations.length > 0 ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary",
      href: "/escalations/customer",
      pulse: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Link key={s.label} href={s.href} className="block">
          <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <div className={`flex h-7 w-7 items-center justify-center rounded-md ${s.iconBg}`}>
                <s.icon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="flex items-end justify-between gap-2">
              <p className="text-2xl font-bold text-foreground leading-none">
                {typeof s.value === "number" ? s.value : (
                  <span className="text-base font-semibold">{s.value}</span>
                )}
              </p>
              {s.pulse && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse mb-1" />}
            </div>
            <p className={`mt-1.5 text-xs ${s.subColor} line-clamp-1`}>{s.sub}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
