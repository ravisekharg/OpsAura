"use client"

import { useEffect, useState } from "react"
import { Shield, Loader2, ChevronDown, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"

const PERMISSION_LABELS: Record<string, string> = {
  "users:view": "View Users", "users:invite": "Invite Users", "users:manage": "Manage Users",
  "teams:view": "View Teams", "teams:manage": "Manage Teams",
  "services:view": "View Services", "services:manage": "Manage Services",
  "schedules:view": "View Schedules", "schedules:manage": "Manage Schedules",
  "overrides:create": "Create Overrides", "oncall:view": "View OnCall",
  "alerts:view": "View Alerts", "alerts:acknowledge": "Acknowledge Alerts",
  "alerts:resolve": "Resolve Alerts", "alerts:manage": "Manage Alerts",
  "escalations:view": "View Escalations", "escalations:manage": "Manage Escalations",
  "escalations:acknowledge": "Acknowledge Escalations",
  "war_rooms:view": "View War Rooms", "war_rooms:create": "Create War Rooms",
  "war_rooms:manage": "Manage War Rooms", "war_rooms:resolve": "Resolve War Rooms",
  "notifications:view": "View Notifications", "notifications:configure": "Configure Notifications",
  "servicenow:manage": "Manage ServiceNow",
  "audit:view": "View Audit", "audit:export": "Export Audit",
  "settings:view": "View Settings", "settings:manage": "Manage Settings",
}

const CATEGORY_ORDER = ["users", "teams", "services", "schedules", "oncall", "alerts", "escalations", "war_rooms", "notifications", "servicenow", "audit", "settings"]

interface Role {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  rolePermissions: Array<{ permission: { resource: string; action: string } }>
}

function groupPermissions(perms: Array<{ permission: { resource: string; action: string } }>) {
  const grouped: Record<string, string[]> = {}
  for (const rp of perms) {
    const key = rp.permission.resource
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(rp.permission.action)
  }
  return grouped
}

export function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    api.get<{ data: Role[] }>("/roles")
      .then((r) => setRoles(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
  if (error) return <p className="text-sm text-destructive">{error}</p>

  return (
    <div className="flex flex-col gap-3">
      {roles.map((role) => {
        const grouped = groupPermissions(role.rolePermissions)
        const totalPerms = role.rolePermissions.length
        const isOpen = expanded === role.id

        return (
          <div key={role.id} className="rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : role.id)}
              className="flex w-full items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 shrink-0">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground capitalize">
                    {role.name.replace(/_/g, " ")}
                  </p>
                  {role.isSystem && (
                    <Badge variant="secondary" className="text-[10px]">System</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {totalPerms} permission{totalPerms !== 1 ? "s" : ""}
                </p>
              </div>
              {isOpen
                ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            </button>

            {isOpen && (
              <div className="border-t border-border px-4 py-4 bg-muted/10">
                {totalPerms === 0 ? (
                  <p className="text-xs text-muted-foreground">No permissions assigned</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {CATEGORY_ORDER.filter((cat) => grouped[cat]).map((cat) => (
                      <div key={cat}>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 capitalize">
                          {cat.replace("_", " ")}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {grouped[cat].map((action) => {
                            const label = PERMISSION_LABELS[`${cat}:${action}`] ?? action
                            return (
                              <Badge key={action} variant="outline" className="text-xs">
                                {label}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
