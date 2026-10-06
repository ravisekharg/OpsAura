import { create } from "zustand"

export type AlertSeverity = "critical" | "high" | "medium" | "low" | "info"
export type AlertStatus = "firing" | "acknowledged" | "resolved" | "suppressed"

export interface Alert {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  status: AlertStatus
  service: string
  source: string
  assignmentGroup: string
  assignedTo: string
  tags: string[]
  fingerprint: string
  dedupCount: number
  correlationGroup?: string
  firedAt: Date
  acknowledgedAt?: Date
  resolvedAt?: Date
}

export interface CorrelationRule {
  id: string
  name: string
  description: string
  matchField: string
  matchValue: string
  groupBy: string
  windowMinutes: number
  active: boolean
  createdAt: Date
}

export interface SuppressionRule {
  id: string
  name: string
  description: string
  matchField: string
  matchValue: string
  reason: string
  expiresAt?: Date
  active: boolean
  createdAt: Date
}

interface AlertState {
  alerts: Alert[]
  correlationRules: CorrelationRule[]
  suppressionRules: SuppressionRule[]
  acknowledge: (id: string, by: string) => void
  resolve: (id: string) => void
  addCorrelationRule: (r: Omit<CorrelationRule, "id" | "createdAt">) => void
  addSuppressionRule: (r: Omit<SuppressionRule, "id" | "createdAt">) => void
  toggleCorrelationRule: (id: string) => void
  toggleSuppressionRule: (id: string) => void
}

const now = new Date()
const minsAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000)

const MOCK_ALERTS: Alert[] = [
  {
    id: "a1", title: "DB connection pool exhausted", description: "PostgreSQL connection pool on tenant_csx hit 100% capacity",
    severity: "critical", status: "firing", service: "Auth Service", source: "Prometheus",
    assignmentGroup: "Platform On-Call", assignedTo: "Ravi Reddy", tags: ["db", "postgres", "prod"],
    fingerprint: "fp-001", dedupCount: 3, firedAt: minsAgo(12),
  },
  {
    id: "a2", title: "API p99 latency > 2s", description: "Payments API p99 response time exceeded SLO threshold",
    severity: "high", status: "firing", service: "Payments API", source: "Datadog",
    assignmentGroup: "Payments On-Call", assignedTo: "Priya Nair", tags: ["latency", "api", "payments"],
    fingerprint: "fp-002", dedupCount: 1, firedAt: minsAgo(25),
  },
  {
    id: "a3", title: "Error rate spike on /checkout", description: "5xx error rate crossed 5% on checkout endpoint",
    severity: "high", status: "acknowledged", service: "Payments API", source: "Datadog",
    assignmentGroup: "Payments On-Call", assignedTo: "Priya Nair", tags: ["errors", "checkout"],
    fingerprint: "fp-003", dedupCount: 8, firedAt: minsAgo(45), acknowledgedAt: minsAgo(38),
  },
  {
    id: "a4", title: "Disk usage > 85%", description: "Disk usage on analytics-worker-02 exceeded warning threshold",
    severity: "medium", status: "firing", service: "Analytics Pipeline", source: "CloudWatch",
    assignmentGroup: "Data On-Call", assignedTo: "Arjun Sharma", tags: ["disk", "infra"],
    fingerprint: "fp-004", dedupCount: 1, firedAt: minsAgo(60),
  },
  {
    id: "a5", title: "Certificate expiry in 14 days", description: "TLS certificate for api.tessell.com expires in 14 days",
    severity: "low", status: "firing", service: "Auth Service", source: "CertManager",
    assignmentGroup: "Platform On-Call", assignedTo: "", tags: ["tls", "cert"],
    fingerprint: "fp-005", dedupCount: 1, firedAt: minsAgo(180),
  },
  {
    id: "a6", title: "Notification queue lag", description: "Email notification queue backed up by 2000+ messages",
    severity: "medium", status: "resolved", service: "Notification Service", source: "Prometheus",
    assignmentGroup: "Platform On-Call", assignedTo: "Ravi Reddy", tags: ["queue", "notifications"],
    fingerprint: "fp-006", dedupCount: 2, firedAt: minsAgo(240), resolvedAt: minsAgo(120),
  },
  {
    id: "a7", title: "Memory usage > 90%", description: "JVM heap on payments-service-03 at 92%",
    severity: "high", status: "resolved", service: "Payments API", source: "Prometheus",
    assignmentGroup: "Payments On-Call", assignedTo: "Priya Nair", tags: ["memory", "jvm"],
    fingerprint: "fp-007", dedupCount: 5, firedAt: minsAgo(360), resolvedAt: minsAgo(300),
  },
]

const MOCK_CORRELATION_RULES: CorrelationRule[] = [
  {
    id: "cr1", name: "Group Payments Alerts", description: "Correlate all alerts from Payments API within 5 min window",
    matchField: "service", matchValue: "Payments API", groupBy: "service", windowMinutes: 5, active: true, createdAt: new Date("2025-02-01"),
  },
  {
    id: "cr2", name: "Group Platform Infra Alerts", description: "Correlate disk/memory alerts across platform services",
    matchField: "tag", matchValue: "infra", groupBy: "tag", windowMinutes: 10, active: true, createdAt: new Date("2025-02-15"),
  },
]

const MOCK_SUPPRESSION_RULES: SuppressionRule[] = [
  {
    id: "sr1", name: "Suppress maintenance alerts", description: "Suppress all alerts from analytics during maintenance window",
    matchField: "service", matchValue: "Analytics Pipeline", reason: "Scheduled maintenance",
    expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000), active: true, createdAt: new Date("2025-05-30"),
  },
  {
    id: "sr2", name: "Suppress cert expiry warnings", description: "Suppress cert expiry warnings while renewal is in progress",
    matchField: "tag", matchValue: "cert", reason: "Certificate renewal in progress",
    active: false, createdAt: new Date("2025-04-01"),
  },
]

export const useAlertStore = create<AlertState>((set) => ({
  alerts: MOCK_ALERTS,
  correlationRules: MOCK_CORRELATION_RULES,
  suppressionRules: MOCK_SUPPRESSION_RULES,

  acknowledge: (id, by) =>
    set((s) => ({
      alerts: s.alerts.map((a) =>
        a.id === id ? { ...a, status: "acknowledged", assignedTo: by, acknowledgedAt: new Date() } : a
      ),
    })),

  resolve: (id) =>
    set((s) => ({
      alerts: s.alerts.map((a) =>
        a.id === id ? { ...a, status: "resolved", resolvedAt: new Date() } : a
      ),
    })),

  addCorrelationRule: (r) =>
    set((s) => ({ correlationRules: [...s.correlationRules, { ...r, id: crypto.randomUUID(), createdAt: new Date() }] })),

  addSuppressionRule: (r) =>
    set((s) => ({ suppressionRules: [...s.suppressionRules, { ...r, id: crypto.randomUUID(), createdAt: new Date() }] })),

  toggleCorrelationRule: (id) =>
    set((s) => ({ correlationRules: s.correlationRules.map((r) => r.id === id ? { ...r, active: !r.active } : r) })),

  toggleSuppressionRule: (id) =>
    set((s) => ({ suppressionRules: s.suppressionRules.map((r) => r.id === id ? { ...r, active: !r.active } : r) })),
}))
