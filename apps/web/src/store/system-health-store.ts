import { create } from "zustand"

export type ServiceStatus = "operational" | "degraded" | "outage" | "maintenance"
export type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved"

export interface HealthService {
  id: string
  name: string
  category: string
  status: ServiceStatus
  uptimePercent: number
  latencyMs: number
  errorRatePercent: number
  lastCheckedAt: Date
}

export interface StatusIncident {
  id: string
  title: string
  status: IncidentStatus
  affectedServices: string[]
  message: string
  createdAt: Date
  resolvedAt?: Date
}

export interface HealthMetric {
  timestamp: Date
  latencyMs: number
  errorRate: number
  requestsPerMin: number
}

interface SystemHealthState {
  services: HealthService[]
  incidents: StatusIncident[]
  metrics: Record<string, HealthMetric[]>
  refreshedAt: Date
  refresh: () => void
}

const now = new Date()
const minsAgo = (m: number) => new Date(now.getTime() - m * 60000)

function mockMetrics(baseLatency: number, baseError: number): HealthMetric[] {
  return Array.from({ length: 24 }, (_, i) => ({
    timestamp: minsAgo((23 - i) * 60),
    latencyMs: baseLatency + Math.floor(Math.random() * 40 - 20),
    errorRate: Math.max(0, baseError + (Math.random() * 0.4 - 0.2)),
    requestsPerMin: 200 + Math.floor(Math.random() * 100),
  }))
}

const MOCK_SERVICES: HealthService[] = [
  { id: "hs1", name: "Alert Engine", category: "Core", status: "operational", uptimePercent: 99.97, latencyMs: 42, errorRatePercent: 0.01, lastCheckedAt: minsAgo(1) },
  { id: "hs2", name: "OnCall Resolver", category: "Core", status: "operational", uptimePercent: 99.99, latencyMs: 18, errorRatePercent: 0.00, lastCheckedAt: minsAgo(1) },
  { id: "hs3", name: "Notification Service", category: "Core", status: "degraded", uptimePercent: 99.41, latencyMs: 380, errorRatePercent: 2.4, lastCheckedAt: minsAgo(1) },
  { id: "hs4", name: "Voice Call Provider", category: "Integrations", status: "degraded", uptimePercent: 98.80, latencyMs: 620, errorRatePercent: 4.1, lastCheckedAt: minsAgo(1) },
  { id: "hs5", name: "Escalation Engine", category: "Core", status: "operational", uptimePercent: 99.95, latencyMs: 55, errorRatePercent: 0.05, lastCheckedAt: minsAgo(1) },
  { id: "hs6", name: "War Room Service", category: "Core", status: "operational", uptimePercent: 99.93, latencyMs: 67, errorRatePercent: 0.02, lastCheckedAt: minsAgo(1) },
  { id: "hs7", name: "ServiceNow Sync", category: "Integrations", status: "operational", uptimePercent: 99.70, latencyMs: 210, errorRatePercent: 0.3, lastCheckedAt: minsAgo(1) },
  { id: "hs8", name: "Slack Integration", category: "Integrations", status: "operational", uptimePercent: 99.85, latencyMs: 95, errorRatePercent: 0.1, lastCheckedAt: minsAgo(1) },
  { id: "hs9", name: "Database — Platform", category: "Infrastructure", status: "operational", uptimePercent: 99.99, latencyMs: 8, errorRatePercent: 0.00, lastCheckedAt: minsAgo(1) },
  { id: "hs10", name: "Database — Tenants", category: "Infrastructure", status: "operational", uptimePercent: 99.98, latencyMs: 11, errorRatePercent: 0.01, lastCheckedAt: minsAgo(1) },
  { id: "hs11", name: "API Gateway", category: "Infrastructure", status: "operational", uptimePercent: 99.99, latencyMs: 14, errorRatePercent: 0.00, lastCheckedAt: minsAgo(1) },
  { id: "hs12", name: "Auth Service", category: "Core", status: "operational", uptimePercent: 99.96, latencyMs: 31, errorRatePercent: 0.02, lastCheckedAt: minsAgo(1) },
]

const MOCK_INCIDENTS: StatusIncident[] = [
  {
    id: "si1", title: "Voice Call Provider Elevated Latency", status: "investigating",
    affectedServices: ["Voice Call Provider"],
    message: "We are investigating elevated latency and failure rates on outbound voice calls. Alert notifications via email and Slack are unaffected.",
    createdAt: minsAgo(35),
  },
  {
    id: "si2", title: "Notification Service Degraded Performance", status: "identified",
    affectedServices: ["Notification Service", "Voice Call Provider"],
    message: "Root cause identified: upstream SMTP relay rate-limiting. We are switching to backup relay. Estimated resolution in 20 minutes.",
    createdAt: minsAgo(50),
  },
  {
    id: "si3", title: "Database Maintenance Window", status: "resolved",
    affectedServices: ["Database — Tenants"],
    message: "Scheduled read replica failover completed successfully. No data loss. All tenant databases operational.",
    createdAt: minsAgo(1440), resolvedAt: minsAgo(1380),
  },
]

export const useSystemHealthStore = create<SystemHealthState>((set) => ({
  services: MOCK_SERVICES,
  incidents: MOCK_INCIDENTS,
  refreshedAt: now,
  metrics: {
    hs3: mockMetrics(380, 2.4),
    hs4: mockMetrics(620, 4.1),
    hs1: mockMetrics(42, 0.01),
    hs11: mockMetrics(14, 0.0),
  },
  refresh: () => set((s) => ({
    services: s.services.map((svc) => ({ ...svc, lastCheckedAt: new Date() })),
    refreshedAt: new Date(),
  })),
}))
