import { create } from "zustand"

export type SyncStatus = "synced" | "failed" | "pending" | "partial"
export type ConnectionStatus = "connected" | "disconnected" | "testing"

export interface ServiceNowConnection {
  id: string
  name: string
  instanceUrl: string
  username: string
  password: string
  clientId: string
  clientSecret: string
  status: ConnectionStatus
  lastTestedAt?: Date
  createdAt: Date
}

export interface ServiceNowAssignmentGroup {
  id: string
  connectionId: string
  snGroupId: string
  snGroupName: string
  localGroupId: string
  localGroupName: string
  autoSync: boolean
  lastSyncedAt?: Date
  syncStatus: SyncStatus
}

export interface SyncLog {
  id: string
  connectionId: string
  connectionName: string
  operation: "pull_groups" | "push_alert" | "push_incident" | "sync_users"
  status: SyncStatus
  recordsAffected: number
  message: string
  errorDetail?: string
  executedAt: Date
  durationMs: number
}

interface ServiceNowState {
  connections: ServiceNowConnection[]
  assignmentGroups: ServiceNowAssignmentGroup[]
  syncLogs: SyncLog[]
  addConnection: (c: Omit<ServiceNowConnection, "id" | "createdAt" | "status">) => void
  updateConnection: (id: string, patch: Partial<ServiceNowConnection>) => void
  testConnection: (id: string) => Promise<void>
  addAssignmentGroupMapping: (m: Omit<ServiceNowAssignmentGroup, "id">) => void
  toggleAutoSync: (id: string) => void
  triggerSync: (connectionId: string) => void
}

const now = new Date()
const minsAgo = (m: number) => new Date(now.getTime() - m * 60000)

const MOCK_CONNECTIONS: ServiceNowConnection[] = [
  {
    id: "sn1", name: "CSX Production", instanceUrl: "https://csx.service-now.com",
    username: "opsaura_svc", password: "", clientId: "abc123", clientSecret: "",
    status: "connected", lastTestedAt: minsAgo(30), createdAt: new Date("2025-02-01"),
  },
  {
    id: "sn2", name: "Infosys UAT", instanceUrl: "https://infosys-uat.service-now.com",
    username: "opsaura_svc", password: "", clientId: "def456", clientSecret: "",
    status: "disconnected", lastTestedAt: minsAgo(1440), createdAt: new Date("2025-03-10"),
  },
]

const MOCK_ASSIGNMENT_GROUPS: ServiceNowAssignmentGroup[] = [
  { id: "snag1", connectionId: "sn1", snGroupId: "SNG001", snGroupName: "Platform Engineering - CSX", localGroupId: "ag1", localGroupName: "Platform On-Call", autoSync: true, lastSyncedAt: minsAgo(60), syncStatus: "synced" },
  { id: "snag2", connectionId: "sn1", snGroupId: "SNG002", snGroupName: "Payments Team - CSX", localGroupId: "ag2", localGroupName: "Payments On-Call", autoSync: true, lastSyncedAt: minsAgo(60), syncStatus: "synced" },
  { id: "snag3", connectionId: "sn1", snGroupId: "SNG003", snGroupName: "Data Engineering - CSX", localGroupId: "ag3", localGroupName: "Data On-Call", autoSync: false, lastSyncedAt: minsAgo(720), syncStatus: "partial" },
  { id: "snag4", connectionId: "sn2", snGroupId: "SNG101", snGroupName: "Infosys Platform", localGroupId: "ag1", localGroupName: "Platform On-Call", autoSync: false, syncStatus: "failed" },
]

const MOCK_SYNC_LOGS: SyncLog[] = [
  { id: "sl1", connectionId: "sn1", connectionName: "CSX Production", operation: "pull_groups", status: "synced", recordsAffected: 3, message: "Successfully pulled 3 assignment groups", executedAt: minsAgo(60), durationMs: 842 },
  { id: "sl2", connectionId: "sn1", connectionName: "CSX Production", operation: "push_alert", status: "synced", recordsAffected: 1, message: "Alert #a1 pushed as INC0089234", executedAt: minsAgo(10), durationMs: 421 },
  { id: "sl3", connectionId: "sn1", connectionName: "CSX Production", operation: "push_incident", status: "synced", recordsAffected: 1, message: "War room #WR-089 pushed as INC0089235", executedAt: minsAgo(44), durationMs: 613 },
  { id: "sl4", connectionId: "sn2", connectionName: "Infosys UAT", operation: "pull_groups", status: "failed", recordsAffected: 0, message: "Connection failed", errorDetail: "SSL handshake timeout after 30s", executedAt: minsAgo(1440), durationMs: 30021 },
  { id: "sl5", connectionId: "sn1", connectionName: "CSX Production", operation: "sync_users", status: "partial", recordsAffected: 5, message: "5 of 8 users synced, 3 skipped (no matching email)", executedAt: minsAgo(720), durationMs: 2341 },
]

export const useServiceNowStore = create<ServiceNowState>((set) => ({
  connections: MOCK_CONNECTIONS,
  assignmentGroups: MOCK_ASSIGNMENT_GROUPS,
  syncLogs: MOCK_SYNC_LOGS,

  addConnection: (c) => set((s) => ({
    connections: [...s.connections, { ...c, id: crypto.randomUUID(), status: "disconnected", createdAt: new Date() }],
  })),

  updateConnection: (id, patch) => set((s) => ({
    connections: s.connections.map((c) => c.id === id ? { ...c, ...patch } : c),
  })),

  testConnection: async (id) => {
    set((s) => ({ connections: s.connections.map((c) => c.id === id ? { ...c, status: "testing" } : c) }))
    await new Promise((r) => setTimeout(r, 1500))
    set((s) => ({
      connections: s.connections.map((c) =>
        c.id === id ? { ...c, status: "connected", lastTestedAt: new Date() } : c
      ),
    }))
  },

  addAssignmentGroupMapping: (m) => set((s) => ({
    assignmentGroups: [...s.assignmentGroups, { ...m, id: crypto.randomUUID() }],
  })),

  toggleAutoSync: (id) => set((s) => ({
    assignmentGroups: s.assignmentGroups.map((g) => g.id === id ? { ...g, autoSync: !g.autoSync } : g),
  })),

  triggerSync: (connectionId) => set((s) => {
    const connection = s.connections.find((c) => c.id === connectionId)
    const log: SyncLog = {
      id: crypto.randomUUID(), connectionId, connectionName: connection?.name ?? "",
      operation: "pull_groups", status: "synced", recordsAffected: 0,
      message: "Manual sync triggered", executedAt: new Date(), durationMs: 0,
    }
    return { syncLogs: [log, ...s.syncLogs] }
  }),
}))
