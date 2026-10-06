import { create } from "zustand"
import { api } from "@/lib/api-client"

export interface AssignmentGroup {
  id: string
  name: string
  description?: string
  team?: { id: string; name: string } | null
  oncallPolicy?: string
  escalationPolicy?: { id: string; name: string } | null
  active: boolean
  createdAt: string
  _count?: { serviceOwnerships: number; routingRules: number }
}

export type RuleConditionField = "service" | "severity" | "source" | "tag" | "region"
export type RuleConditionOperator = "equals" | "contains" | "starts_with" | "in"

export interface RuleCondition {
  field: RuleConditionField
  operator: RuleConditionOperator
  value: string
}

export interface RoutingRule {
  id: string
  name: string
  priority: number
  conditions: RuleCondition[]
  assignmentGroup: { id: string; name: string }
  active: boolean
  createdAt: string
}

export interface ServiceOwnership {
  serviceId: string
  serviceName: string
  team: string
  primaryOwner: string
  secondaryOwner: string
  assignmentGroup: string
  tier: "P0" | "P1" | "P2" | "P3"
}

interface AssignmentState {
  groups: AssignmentGroup[]
  rules: RoutingRule[]
  isLoading: boolean
  error: string | null

  fetchGroups: (search?: string) => Promise<void>
  fetchRules: () => Promise<void>

  addGroup: (data: Omit<AssignmentGroup, "id" | "createdAt" | "_count">) => Promise<void>
  updateGroup: (id: string, data: Partial<AssignmentGroup>) => Promise<void>
  toggleGroup: (id: string) => Promise<void>
  removeGroup: (id: string) => Promise<void>

  addRule: (data: Omit<RoutingRule, "id" | "createdAt">) => Promise<void>
  updateRule: (id: string, data: Partial<RoutingRule>) => Promise<void>
  toggleRule: (id: string) => Promise<void>
  removeRule: (id: string) => Promise<void>
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  groups: [],
  rules: [],
  isLoading: false,
  error: null,

  fetchGroups: async (search) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get<{ data: AssignmentGroup[] }>(
        "/assignment-groups",
        search ? { search } : undefined
      )
      set({ groups: res.data, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  fetchRules: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get<{ data: RoutingRule[] }>("/routing-rules")
      set({ rules: res.data, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  addGroup: async (data) => {
    const res = await api.post<{ data: AssignmentGroup }>("/assignment-groups", {
      name: data.name,
      description: data.description,
      teamId: (data.team as any)?.id,
      oncallPolicy: data.oncallPolicy,
      active: data.active,
    })
    set((s) => ({ groups: [...s.groups, res.data] }))
  },

  updateGroup: async (id, data) => {
    const res = await api.patch<{ data: AssignmentGroup }>(`/assignment-groups/${id}`, data)
    set((s) => ({ groups: s.groups.map((g) => (g.id === id ? res.data : g)) }))
  },

  toggleGroup: async (id) => {
    const group = get().groups.find((g) => g.id === id)
    if (!group) return
    await get().updateGroup(id, { active: !group.active })
  },

  removeGroup: async (id) => {
    await api.delete(`/assignment-groups/${id}`)
    set((s) => ({ groups: s.groups.filter((g) => g.id !== id) }))
  },

  addRule: async (data) => {
    const res = await api.post<{ data: RoutingRule }>("/routing-rules", {
      name: data.name,
      priority: data.priority,
      conditions: data.conditions,
      assignmentGroupId: data.assignmentGroup.id,
      active: data.active,
    })
    set((s) => ({
      rules: [...s.rules, res.data].sort((a, b) => a.priority - b.priority),
    }))
  },

  updateRule: async (id, data) => {
    const res = await api.patch<{ data: RoutingRule }>(`/routing-rules/${id}`, data)
    set((s) => ({ rules: s.rules.map((r) => (r.id === id ? res.data : r)) }))
  },

  toggleRule: async (id) => {
    const rule = get().rules.find((r) => r.id === id)
    if (!rule) return
    await get().updateRule(id, { active: !rule.active })
  },

  removeRule: async (id) => {
    await api.delete(`/routing-rules/${id}`)
    set((s) => ({ rules: s.rules.filter((r) => r.id !== id) }))
  },
}))
