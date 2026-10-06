"use client"

import { useSystemHealthStore, type IncidentStatus } from "@/store/system-health-store"
import { Badge } from "@/components/ui/badge"

const statusVariant: Record<IncidentStatus, "destructive" | "warning" | "secondary" | "success"> = {
  investigating: "destructive",
  identified: "warning",
  monitoring: "secondary",
  resolved: "success",
}

const statusLabel: Record<IncidentStatus, string> = {
  investigating: "Investigating",
  identified: "Identified",
  monitoring: "Monitoring",
  resolved: "Resolved",
}

function fmt(date: Date) {
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })
}

export function IncidentsList() {
  const incidents = useSystemHealthStore((s) => s.incidents)
  const active = incidents.filter((i) => i.status !== "resolved")
  const resolved = incidents.filter((i) => i.status === "resolved")

  return (
    <div className="flex flex-col gap-4">
      {active.length === 0 && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">No active incidents</p>
        </div>
      )}

      {active.map((inc) => (
        <div key={inc.id} className="rounded-lg border border-amber-500/30 bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={statusVariant[inc.status]}>{statusLabel[inc.status]}</Badge>
                {inc.affectedServices.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                ))}
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">{inc.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{inc.message}</p>
            </div>
            <p className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{fmt(inc.createdAt)}</p>
          </div>
        </div>
      ))}

      {resolved.length > 0 && (
        <>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">Resolved Incidents</h3>
          {resolved.map((inc) => (
            <div key={inc.id} className="rounded-lg border border-border bg-card/50 p-4 opacity-70">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="success">Resolved</Badge>
                    {inc.affectedServices.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">{inc.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{inc.message}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground whitespace-nowrap shrink-0">
                  <p>{fmt(inc.createdAt)}</p>
                  {inc.resolvedAt && <p className="mt-0.5">Resolved {fmt(inc.resolvedAt)}</p>}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
