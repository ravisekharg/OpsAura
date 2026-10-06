import { create } from "zustand"

export type EscalationStepType = "oncall" | "user" | "team" | "assignment_group"
export type EscalationCondition = "no_ack" | "no_resolve" | "always"
export type EscalationType = "internal" | "customer" | "vendor"
export type EscalationStatus = "open" | "acknowledged" | "resolved" | "escalated"
export type EscalationPriority = "P0" | "P1" | "P2" | "P3"

export interface EscalationStep {
  order: number
  type: EscalationStepType
  target: string
  delayMinutes: number
  condition: EscalationCondition
  notifyChannels: string[]
}

export interface EscalationPolicy {
  id: string
  name: string
  description: string
  team: string
  steps: EscalationStep[]
  repeatCount: number
  active: boolean
  createdAt: Date
}

export interface Escalation {
  id: string
  title: string
  description: string
  type: EscalationType
  priority: EscalationPriority
  status: EscalationStatus
  service: string
  policyId: string
  policyName: string
  currentStep: number
  assignedTo: string
  contactName: string
  contactEmail: string
  contactCompany: string
  alertId?: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

interface EscalationState {
  policies: EscalationPolicy[]
  escalations: Escalation[]
  addPolicy: (p: Omit<EscalationPolicy, "id" | "createdAt">) => void
  addEscalation: (e: Omit<Escalation, "id" | "createdAt" | "updatedAt">) => void
  updateEscalationStatus: (id: string, status: EscalationStatus) => void
  acknowledgeEscalation: (id: string, by: string) => void
}

const MOCK_POLICIES: EscalationPolicy[] = [
  {
    id: "ep1", name: "Platform Escalation", description: "Default escalation for platform services",
    team: "Platform Engineering",
    steps: [
      { order: 1, type: "oncall", target: "Platform On-Call", delayMinutes: 5, condition: "no_ack", notifyChannels: ["voice", "slack"] },
      { order: 2, type: "team", target: "Platform Engineering", delayMinutes: 15, condition: "no_ack", notifyChannels: ["slack", "email"] },
      { order: 3, type: "user", target: "Ravi Reddy", delayMinutes: 30, condition: "no_resolve", notifyChannels: ["voice", "email"] },
    ],
    repeatCount: 2, active: true, createdAt: new Date("2025-01-20"),
  },
  {
    id: "ep2", name: "Payments Escalation", description: "High-priority escalation for payment services",
    team: "Backend Services",
    steps: [
      { order: 1, type: "oncall", target: "Payments On-Call", delayMinutes: 3, condition: "no_ack", notifyChannels: ["voice", "slack"] },
      { order: 2, type: "user", target: "Priya Nair", delayMinutes: 10, condition: "no_ack", notifyChannels: ["voice", "slack"] },
      { order: 3, type: "assignment_group", target: "Payments On-Call", delayMinutes: 20, condition: "no_resolve", notifyChannels: ["voice", "email", "slack"] },
    ],
    repeatCount: 3, active: true, createdAt: new Date("2025-01-25"),
  },
]

const now = new Date()
const minsAgo = (m: number) => new Date(now.getTime() - m * 60000)

const MOCK_ESCALATIONS: Escalation[] = [
  {
    id: "esc1", title: "Payment gateway down — CSX Production", description: "Payment gateway returning 503 for all transactions on tenant_csx",
    type: "customer", priority: "P0", status: "escalated",
    service: "Payments API", policyId: "ep2", policyName: "Payments Escalation",
    currentStep: 2, assignedTo: "Priya Nair",
    contactName: "Rajesh Kumar", contactEmail: "rajesh.kumar@csx.com", contactCompany: "CSX Technologies",
    alertId: "a2", createdAt: minsAgo(45), updatedAt: minsAgo(10),
  },
  {
    id: "esc2", title: "Auth service degraded — Infosys UAT", description: "Login failures on Infosys UAT environment",
    type: "customer", priority: "P1", status: "acknowledged",
    service: "Auth Service", policyId: "ep1", policyName: "Platform Escalation",
    currentStep: 1, assignedTo: "Ravi Reddy",
    contactName: "Sunita Rao", contactEmail: "sunita.rao@infosys.com", contactCompany: "Infosys",
    alertId: "a1", createdAt: minsAgo(90), updatedAt: minsAgo(60),
  },
  {
    id: "esc3", title: "Cloud provider SLA breach — AWS Mumbai", description: "AWS Mumbai region RDS latency spike breaching SLA",
    type: "vendor", priority: "P1", status: "open",
    service: "Auth Service", policyId: "ep1", policyName: "Platform Escalation",
    currentStep: 1, assignedTo: "",
    contactName: "AWS Support", contactEmail: "support@aws.amazon.com", contactCompany: "Amazon Web Services",
    createdAt: minsAgo(30), updatedAt: minsAgo(30),
  },
  {
    id: "esc4", title: "Data pipeline SLA breach — Wipro", description: "Analytics data delivery delayed by 4+ hours",
    type: "customer", priority: "P2", status: "resolved",
    service: "Analytics Pipeline", policyId: "ep1", policyName: "Platform Escalation",
    currentStep: 1, assignedTo: "Arjun Sharma",
    contactName: "Mohan Das", contactEmail: "mohan.das@wipro.com", contactCompany: "Wipro",
    createdAt: minsAgo(300), updatedAt: minsAgo(60), resolvedAt: minsAgo(60),
  },
]

export const useEscalationStore = create<EscalationState>((set) => ({
  policies: MOCK_POLICIES,
  escalations: MOCK_ESCALATIONS,

  addPolicy: (p) => set((s) => ({ policies: [...s.policies, { ...p, id: crypto.randomUUID(), createdAt: new Date() }] })),

  addEscalation: (e) => set((s) => ({
    escalations: [...s.escalations, { ...e, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() }],
  })),

  updateEscalationStatus: (id, status) => set((s) => ({
    escalations: s.escalations.map((e) =>
      e.id === id ? { ...e, status, updatedAt: new Date(), ...(status === "resolved" ? { resolvedAt: new Date() } : {}) } : e
    ),
  })),

  acknowledgeEscalation: (id, by) => set((s) => ({
    escalations: s.escalations.map((e) =>
      e.id === id ? { ...e, status: "acknowledged", assignedTo: by, updatedAt: new Date() } : e
    ),
  })),
}))
