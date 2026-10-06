import { create } from "zustand"

export type AuditCategory =
  | "auth" | "user" | "team" | "service" | "schedule" | "oncall"
  | "alert" | "escalation" | "war_room" | "integration" | "settings" | "tenant"

export type AuditSeverity = "info" | "warning" | "critical"

export interface AuditEvent {
  id: string
  category: AuditCategory
  action: string
  actor: string
  actorEmail: string
  target: string
  detail: string
  severity: AuditSeverity
  ipAddress: string
  userAgent: string
  createdAt: Date
}

interface AuditState {
  events: AuditEvent[]
  log: (e: Omit<AuditEvent, "id" | "createdAt">) => void
}

const now = new Date()
const minsAgo = (m: number) => new Date(now.getTime() - m * 60000)

const MOCK_EVENTS: AuditEvent[] = [
  { id: "ae1", category: "auth", action: "LOGIN_SUCCESS", actor: "Ravi Reddy", actorEmail: "ravi.reddy@opsaura.io", target: "Session", detail: "User logged in successfully", severity: "info", ipAddress: "103.21.58.12", userAgent: "Chrome/125", createdAt: minsAgo(5) },
  { id: "ae2", category: "alert", action: "ALERT_ACKNOWLEDGED", actor: "Ravi Reddy", actorEmail: "ravi.reddy@opsaura.io", target: "Alert #a1", detail: "Alert 'DB connection pool exhausted' acknowledged", severity: "info", ipAddress: "103.21.58.12", userAgent: "Chrome/125", createdAt: minsAgo(12) },
  { id: "ae3", category: "war_room", action: "WAR_ROOM_OPENED", actor: "System", actorEmail: "system@opsaura.io", target: "War Room #wr1", detail: "War Room opened automatically from Alert #a1", severity: "warning", ipAddress: "internal", userAgent: "OpsAura/1.0", createdAt: minsAgo(43) },
  { id: "ae4", category: "escalation", action: "ESCALATION_TRIGGERED", actor: "System", actorEmail: "system@opsaura.io", target: "Escalation #esc1", detail: "Alert #a2 escalated — no ACK after 5 minutes", severity: "warning", ipAddress: "internal", userAgent: "OpsAura/1.0", createdAt: minsAgo(45) },
  { id: "ae5", category: "user", action: "USER_INVITED", actor: "Ravi Reddy", actorEmail: "ravi.reddy@opsaura.io", target: "meera.iyer@opsaura.io", detail: "User invited with role OnCall Manager", severity: "info", ipAddress: "103.21.58.12", userAgent: "Chrome/125", createdAt: minsAgo(120) },
  { id: "ae6", category: "schedule", action: "OVERRIDE_CREATED", actor: "Ravi Reddy", actorEmail: "ravi.reddy@opsaura.io", target: "Platform On-Call Schedule", detail: "Override created: Priya Nair covering Ravi Reddy from Jun 3–5", severity: "info", ipAddress: "103.21.58.12", userAgent: "Chrome/125", createdAt: minsAgo(180) },
  { id: "ae7", category: "integration", action: "SERVICENOW_SYNC", actor: "System", actorEmail: "system@opsaura.io", target: "CSX Production", detail: "Assignment groups synced — 3 records updated", severity: "info", ipAddress: "internal", userAgent: "OpsAura/1.0", createdAt: minsAgo(60) },
  { id: "ae8", category: "auth", action: "LOGIN_FAILED", actor: "Unknown", actorEmail: "unknown@example.com", target: "Session", detail: "Failed login attempt — invalid password (3rd attempt)", severity: "warning", ipAddress: "91.108.4.200", userAgent: "Python/3.11", createdAt: minsAgo(90) },
  { id: "ae9", category: "settings", action: "SETTINGS_UPDATED", actor: "Ravi Reddy", actorEmail: "ravi.reddy@opsaura.io", target: "Tenant Settings", detail: "Notification preference updated — voice alerts enabled for P0", severity: "info", ipAddress: "103.21.58.12", userAgent: "Chrome/125", createdAt: minsAgo(240) },
  { id: "ae10", category: "team", action: "TEAM_CREATED", actor: "Ravi Reddy", actorEmail: "ravi.reddy@opsaura.io", target: "Platform Engineering", detail: "Team 'Platform Engineering' created", severity: "info", ipAddress: "103.21.58.12", userAgent: "Chrome/125", createdAt: minsAgo(300) },
  { id: "ae11", category: "alert", action: "SUPPRESSION_RULE_CREATED", actor: "Priya Nair", actorEmail: "priya.nair@opsaura.io", target: "Suppression Rule #sr1", detail: "Suppression rule created for Analytics Pipeline during maintenance window", severity: "warning", ipAddress: "103.21.58.15", userAgent: "Chrome/125", createdAt: minsAgo(360) },
  { id: "ae12", category: "war_room", action: "WAR_ROOM_RESOLVED", actor: "Priya Nair", actorEmail: "priya.nair@opsaura.io", target: "War Room #wr2", detail: "Incident resolved — root cause: N+1 query in checkout flow", severity: "info", ipAddress: "103.21.58.15", userAgent: "Chrome/125", createdAt: minsAgo(120) },
  { id: "ae13", category: "tenant", action: "TENANT_ONBOARDED", actor: "Platform Admin", actorEmail: "admin@opsaura.io", target: "tenant_wipro", detail: "Tenant wipro onboarded — database provisioned, migrations run, admin created", severity: "info", ipAddress: "10.0.0.1", userAgent: "Chrome/125", createdAt: minsAgo(1440) },
  { id: "ae14", category: "auth", action: "SESSION_EXPIRED", actor: "Arjun Sharma", actorEmail: "arjun.sharma@opsaura.io", target: "Session", detail: "Session expired after 8h inactivity", severity: "info", ipAddress: "103.21.58.18", userAgent: "Firefox/126", createdAt: minsAgo(480) },
  { id: "ae15", category: "oncall", action: "ONCALL_NOTIFIED", actor: "System", actorEmail: "system@opsaura.io", target: "Priya Nair", detail: "Voice call placed to on-call engineer for Alert #a2", severity: "info", ipAddress: "internal", userAgent: "OpsAura/1.0", createdAt: minsAgo(25) },
]

export const useAuditStore = create<AuditState>((set) => ({
  events: MOCK_EVENTS,
  log: (e) => set((s) => ({ events: [{ ...e, id: crypto.randomUUID(), createdAt: new Date() }, ...s.events] })),
}))
