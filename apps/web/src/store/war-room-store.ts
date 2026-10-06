import { create } from "zustand"

export type WarRoomStatus = "active" | "resolved" | "archived"
export type ParticipantRole = "incident_commander" | "engineer" | "observer" | "executive"
export type ActionStatus = "open" | "in_progress" | "done"
export type TimelineEventType = "opened" | "joined" | "left" | "action_created" | "action_done" | "status_changed" | "note" | "alert_linked" | "resolved"

export interface Participant {
  userId: string
  name: string
  email: string
  role: ParticipantRole
  joinedAt: Date
}

export interface ActionItem {
  id: string
  warRoomId: string
  title: string
  assignedTo: string
  status: ActionStatus
  dueAt?: Date
  createdAt: Date
  completedAt?: Date
}

export interface TimelineEvent {
  id: string
  warRoomId: string
  type: TimelineEventType
  actor: string
  message: string
  createdAt: Date
}

export interface WarRoom {
  id: string
  title: string
  description: string
  status: WarRoomStatus
  severity: "critical" | "high" | "medium"
  service: string
  alertIds: string[]
  incidentCommander: string
  participants: Participant[]
  actions: ActionItem[]
  timeline: TimelineEvent[]
  templateId?: string
  createdAt: Date
  resolvedAt?: Date
}

export interface WarRoomTemplate {
  id: string
  name: string
  description: string
  defaultParticipantRoles: ParticipantRole[]
  defaultActions: string[]
  createdAt: Date
}

interface WarRoomState {
  rooms: WarRoom[]
  templates: WarRoomTemplate[]
  createRoom: (r: Omit<WarRoom, "id" | "createdAt" | "participants" | "actions" | "timeline">) => string
  resolveRoom: (id: string) => void
  addParticipant: (roomId: string, p: Omit<Participant, "joinedAt">) => void
  addAction: (roomId: string, a: Omit<ActionItem, "id" | "warRoomId" | "createdAt">) => void
  updateActionStatus: (roomId: string, actionId: string, status: ActionStatus) => void
  addTimelineEvent: (roomId: string, e: Omit<TimelineEvent, "id" | "warRoomId" | "createdAt">) => void
  addTemplate: (t: Omit<WarRoomTemplate, "id" | "createdAt">) => void
}

const now = new Date()
const minsAgo = (m: number) => new Date(now.getTime() - m * 60000)

const ROOM_1_ID = "wr1"
const ROOM_2_ID = "wr2"

const MOCK_TEMPLATES: WarRoomTemplate[] = [
  {
    id: "wt1", name: "P0 Incident", description: "Standard P0 incident response template",
    defaultParticipantRoles: ["incident_commander", "engineer", "executive"],
    defaultActions: ["Identify root cause", "Notify stakeholders", "Apply fix", "Verify resolution", "Write post-mortem"],
    createdAt: new Date("2025-02-01"),
  },
  {
    id: "wt2", name: "Payment Outage", description: "Payments-specific incident template",
    defaultParticipantRoles: ["incident_commander", "engineer", "observer"],
    defaultActions: ["Check payment gateway status", "Review error logs", "Contact payment provider", "Communicate to customers", "Verify transactions"],
    createdAt: new Date("2025-02-15"),
  },
  {
    id: "wt3", name: "Data Breach Response", description: "Security incident response template",
    defaultParticipantRoles: ["incident_commander", "engineer", "executive", "observer"],
    defaultActions: ["Isolate affected systems", "Preserve evidence", "Notify security team", "Assess scope", "Regulatory notification"],
    createdAt: new Date("2025-03-01"),
  },
]

const room1Participants: Participant[] = [
  { userId: "u1", name: "Ravi Reddy", email: "ravi.reddy@opsaura.io", role: "incident_commander", joinedAt: minsAgo(43) },
  { userId: "u2", name: "Priya Nair", email: "priya.nair@opsaura.io", role: "engineer", joinedAt: minsAgo(41) },
  { userId: "u3", name: "Arjun Sharma", email: "arjun.sharma@opsaura.io", role: "observer", joinedAt: minsAgo(38) },
]

const room1Actions: ActionItem[] = [
  { id: "ac1", warRoomId: ROOM_1_ID, title: "Check DB connection pool config", assignedTo: "Priya Nair", status: "done", createdAt: minsAgo(40), completedAt: minsAgo(25) },
  { id: "ac2", warRoomId: ROOM_1_ID, title: "Increase pool size from 50 to 100", assignedTo: "Priya Nair", status: "in_progress", createdAt: minsAgo(30) },
  { id: "ac3", warRoomId: ROOM_1_ID, title: "Notify CSX stakeholders", assignedTo: "Ravi Reddy", status: "done", createdAt: minsAgo(38), completedAt: minsAgo(35) },
  { id: "ac4", warRoomId: ROOM_1_ID, title: "Verify resolution and close alert", assignedTo: "Ravi Reddy", status: "open", createdAt: minsAgo(10) },
]

const room1Timeline: TimelineEvent[] = [
  { id: "te1", warRoomId: ROOM_1_ID, type: "opened", actor: "System", message: "War Room opened automatically from alert #a1 — DB connection pool exhausted", createdAt: minsAgo(43) },
  { id: "te2", warRoomId: ROOM_1_ID, type: "joined", actor: "Ravi Reddy", message: "Ravi Reddy joined as Incident Commander", createdAt: minsAgo(43) },
  { id: "te3", warRoomId: ROOM_1_ID, type: "joined", actor: "Priya Nair", message: "Priya Nair joined as Engineer", createdAt: minsAgo(41) },
  { id: "te4", warRoomId: ROOM_1_ID, type: "action_created", actor: "Ravi Reddy", message: "Action created: Check DB connection pool config → Priya Nair", createdAt: minsAgo(40) },
  { id: "te5", warRoomId: ROOM_1_ID, type: "note", actor: "Priya Nair", message: "Confirmed pool_size=50, max_overflow=10. Insufficient under current load spike.", createdAt: minsAgo(32) },
  { id: "te6", warRoomId: ROOM_1_ID, type: "action_done", actor: "Priya Nair", message: "Action completed: Check DB connection pool config", createdAt: minsAgo(25) },
  { id: "te7", warRoomId: ROOM_1_ID, type: "action_created", actor: "Priya Nair", message: "Action created: Increase pool size from 50 to 100 → Priya Nair", createdAt: minsAgo(30) },
]

const room2Participants: Participant[] = [
  { userId: "u2", name: "Priya Nair", email: "priya.nair@opsaura.io", role: "incident_commander", joinedAt: minsAgo(180) },
]

const room2Timeline: TimelineEvent[] = [
  { id: "te8", warRoomId: ROOM_2_ID, type: "opened", actor: "Priya Nair", message: "War Room opened for API latency spike on Payments API", createdAt: minsAgo(180) },
  { id: "te9", warRoomId: ROOM_2_ID, type: "resolved", actor: "Priya Nair", message: "Incident resolved — root cause: N+1 query in checkout flow", createdAt: minsAgo(120) },
]

const MOCK_ROOMS: WarRoom[] = [
  {
    id: ROOM_1_ID, title: "DB Connection Pool Exhausted — tenant_csx",
    description: "Critical: PostgreSQL connection pool on tenant_csx at 100% capacity, causing auth failures",
    status: "active", severity: "critical", service: "Auth Service",
    alertIds: ["a1"], incidentCommander: "Ravi Reddy",
    participants: room1Participants, actions: room1Actions, timeline: room1Timeline,
    createdAt: minsAgo(43),
  },
  {
    id: ROOM_2_ID, title: "Payments API p99 Latency Spike",
    description: "p99 latency exceeded 2s SLO on payments checkout endpoint",
    status: "resolved", severity: "high", service: "Payments API",
    alertIds: ["a2"], incidentCommander: "Priya Nair",
    participants: room2Participants, actions: [], timeline: room2Timeline,
    createdAt: minsAgo(180), resolvedAt: minsAgo(120),
  },
]

export const useWarRoomStore = create<WarRoomState>((set) => ({
  rooms: MOCK_ROOMS,
  templates: MOCK_TEMPLATES,

  createRoom: (r) => {
    const id = crypto.randomUUID()
    const openEvent: TimelineEvent = {
      id: crypto.randomUUID(), warRoomId: id, type: "opened",
      actor: "System", message: `War Room opened: ${r.title}`, createdAt: new Date(),
    }
    set((s) => ({
      rooms: [...s.rooms, { ...r, id, createdAt: new Date(), participants: [], actions: [], timeline: [openEvent] }],
    }))
    return id
  },

  resolveRoom: (id) =>
    set((s) => ({
      rooms: s.rooms.map((r) => {
        if (r.id !== id) return r
        const event: TimelineEvent = { id: crypto.randomUUID(), warRoomId: id, type: "resolved", actor: "User", message: "Incident marked as resolved", createdAt: new Date() }
        return { ...r, status: "resolved", resolvedAt: new Date(), timeline: [...r.timeline, event] }
      }),
    })),

  addParticipant: (roomId, p) =>
    set((s) => ({
      rooms: s.rooms.map((r) => {
        if (r.id !== roomId) return r
        const participant: Participant = { ...p, joinedAt: new Date() }
        const event: TimelineEvent = { id: crypto.randomUUID(), warRoomId: roomId, type: "joined", actor: p.name, message: `${p.name} joined as ${p.role.replace("_", " ")}`, createdAt: new Date() }
        return { ...r, participants: [...r.participants, participant], timeline: [...r.timeline, event] }
      }),
    })),

  addAction: (roomId, a) =>
    set((s) => ({
      rooms: s.rooms.map((r) => {
        if (r.id !== roomId) return r
        const action: ActionItem = { ...a, id: crypto.randomUUID(), warRoomId: roomId, createdAt: new Date() }
        const event: TimelineEvent = { id: crypto.randomUUID(), warRoomId: roomId, type: "action_created", actor: "User", message: `Action created: ${a.title} → ${a.assignedTo}`, createdAt: new Date() }
        return { ...r, actions: [...r.actions, action], timeline: [...r.timeline, event] }
      }),
    })),

  updateActionStatus: (roomId, actionId, status) =>
    set((s) => ({
      rooms: s.rooms.map((r) => {
        if (r.id !== roomId) return r
        const actions = r.actions.map((a) =>
          a.id === actionId ? { ...a, status, ...(status === "done" ? { completedAt: new Date() } : {}) } : a
        )
        const action = r.actions.find((a) => a.id === actionId)
        const event: TimelineEvent | null = status === "done" && action
          ? { id: crypto.randomUUID(), warRoomId: roomId, type: "action_done", actor: action.assignedTo, message: `Action completed: ${action.title}`, createdAt: new Date() }
          : null
        return { ...r, actions, timeline: event ? [...r.timeline, event] : r.timeline }
      }),
    })),

  addTimelineEvent: (roomId, e) =>
    set((s) => ({
      rooms: s.rooms.map((r) =>
        r.id !== roomId ? r : { ...r, timeline: [...r.timeline, { ...e, id: crypto.randomUUID(), warRoomId: roomId, createdAt: new Date() }] }
      ),
    })),

  addTemplate: (t) =>
    set((s) => ({ templates: [...s.templates, { ...t, id: crypto.randomUUID(), createdAt: new Date() }] })),
}))
