import { create } from "zustand"
import { api } from "@/lib/api-client"

export type UserRole =
  | "tenant_admin" | "tenant_manager" | "operations_manager" | "oncall_manager"
  | "scheduler" | "engineer" | "incident_commander" | "executive" | "tenant_read_only"

export type UserStatus = "ACTIVE" | "INACTIVE" | "INVITED" | "SUSPENDED"

export interface OrgUser {
  id: string
  name: string
  email: string
  role: { id: string; name: string }
  status: UserStatus
  teamMemberships?: Array<{ team: { id: string; name: string } }>
  createdAt: string
}

export interface Team {
  id: string
  name: string
  description?: string
  lead?: { id: string; name: string; email: string } | null
  members?: Array<{ user: { id: string; name: string; email: string } }>
  _count?: { members: number; services: number }
  createdAt: string
}

export interface Service {
  id: string
  name: string
  description?: string
  team?: { id: string; name: string } | null
  tier: "P0" | "P1" | "P2" | "P3"
  status: "ACTIVE" | "INACTIVE"
  ownership?: {
    primaryUser?: { id: string; name: string } | null
    secondaryUser?: { id: string; name: string } | null
    assignmentGroup?: { id: string; name: string } | null
  } | null
  createdAt: string
}

interface OrganizationState {
  users: OrgUser[]
  teams: Team[]
  services: Service[]
  usersTotal: number
  isLoading: boolean
  error: string | null

  fetchUsers: (params?: { search?: string; status?: string; page?: number }) => Promise<void>
  fetchTeams: (search?: string) => Promise<void>
  fetchServices: (search?: string) => Promise<void>

  inviteUser: (data: { name: string; email: string; roleName: string }) => Promise<void>
  updateUser: (id: string, data: { name?: string; roleName?: string; status?: string }) => Promise<void>
  deactivateUser: (id: string) => Promise<void>

  addTeam: (data: { name: string; description?: string; leadUserId?: string }) => Promise<void>
  updateTeam: (id: string, data: { name?: string; description?: string; leadUserId?: string }) => Promise<void>
  removeTeam: (id: string) => Promise<void>
  addTeamMember: (teamId: string, userId: string) => Promise<void>
  removeTeamMember: (teamId: string, userId: string) => Promise<void>

  addService: (data: { name: string; description?: string; teamId?: string; tier?: string }) => Promise<void>
  updateService: (id: string, data: Partial<Service>) => Promise<void>
  removeService: (id: string) => Promise<void>
}

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  users: [],
  teams: [],
  services: [],
  usersTotal: 0,
  isLoading: false,
  error: null,

  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get<{ data: OrgUser[]; meta: { total: number } }>(
        "/users",
        { search: params.search, status: params.status, page: params.page ?? 1, limit: 50 }
      )
      set({ users: res.data, usersTotal: res.meta?.total ?? res.data.length, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  fetchTeams: async (search) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get<{ data: Team[] }>("/teams", search ? { search } : undefined)
      set({ teams: res.data, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  fetchServices: async (search) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get<{ data: Service[] }>("/services", search ? { search } : undefined)
      set({ services: res.data, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  inviteUser: async (data) => {
    const res = await api.post<{ data: OrgUser }>("/users/invite", data)
    set((s) => ({ users: [res.data, ...s.users] }))
  },

  updateUser: async (id, data) => {
    const res = await api.patch<{ data: OrgUser }>(`/users/${id}`, data)
    set((s) => ({ users: s.users.map((u) => (u.id === id ? res.data : u)) }))
  },

  deactivateUser: async (id) => {
    await api.delete(`/users/${id}`)
    set((s) => ({ users: s.users.filter((u) => u.id !== id) }))
  },

  addTeam: async (data) => {
    const res = await api.post<{ data: Team }>("/teams", data)
    set((s) => ({ teams: [...s.teams, res.data] }))
  },

  updateTeam: async (id, data) => {
    const res = await api.patch<{ data: Team }>(`/teams/${id}`, data)
    set((s) => ({ teams: s.teams.map((t) => (t.id === id ? res.data : t)) }))
  },

  removeTeam: async (id) => {
    await api.delete(`/teams/${id}`)
    set((s) => ({ teams: s.teams.filter((t) => t.id !== id) }))
  },

  addTeamMember: async (teamId, userId) => {
    await api.post(`/teams/${teamId}/members`, { userId })
    await get().fetchTeams()
  },

  removeTeamMember: async (teamId, userId) => {
    await api.delete(`/teams/${teamId}/members/${userId}`)
    await get().fetchTeams()
  },

  addService: async (data) => {
    const res = await api.post<{ data: Service }>("/services", data)
    set((s) => ({ services: [...s.services, res.data] }))
  },

  updateService: async (id, data) => {
    const res = await api.patch<{ data: Service }>(`/services/${id}`, data)
    set((s) => ({ services: s.services.map((sv) => (sv.id === id ? res.data : sv)) }))
  },

  removeService: async (id) => {
    await api.delete(`/services/${id}`)
    set((s) => ({ services: s.services.filter((sv) => sv.id !== id) }))
  },
}))
