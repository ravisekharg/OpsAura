"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useAuditStore } from "@/store/audit-store"
import { Badge } from "@/components/ui/badge"

const categoryColor: Record<string, string> = {
  auth: "text-violet-500", alert: "text-red-500", war_room: "text-rose-500",
  escalation: "text-orange-500", oncall: "text-cyan-500", user: "text-sky-500",
  schedule: "text-teal-500", integration: "text-green-500", settings: "text-gray-400",
  team: "text-blue-500", service: "text-indigo-500", tenant: "text-purple-500",
}

function timeAgo(date: Date) {
  const m = Math.floor((Date.now() - date.getTime()) / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function DashboardRecentActivity() {
  const events = useAuditStore((s) => s.events)
  const recent = [...events].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 8)

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
        <Link href="/admin/audit" className="flex items-center gap-1 text-xs text-primary hover:underline">
          Audit log <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {recent.map((e) => (
          <div key={e.id} className="flex items-start gap-3 px-4 py-2.5">
            <span className={`text-xs font-semibold mt-0.5 shrink-0 w-20 capitalize ${categoryColor[e.category] ?? "text-muted-foreground"}`}>
              {e.category.replace("_", " ")}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground line-clamp-1">{e.detail}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{e.actor} · {timeAgo(e.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
