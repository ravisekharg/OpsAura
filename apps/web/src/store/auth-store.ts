import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ApiError } from "@/lib/api-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4100/v1"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  tenantSlug: string
  avatarUrl?: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string, tenantSlug?: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password, tenantSlug = "demo") => {
        set({ isLoading: true, error: null })
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password, tenantSlug }),
          })

          const json = await res.json()

          if (!res.ok) {
            throw new Error(json.message ?? "Login failed")
          }

          const payload = json.data ?? json

          if (payload.mfaRequired) {
            throw new Error("MFA not yet supported in this client")
          }

          const { accessToken, user } = payload
          document.cookie = `opsaura-auth=${accessToken}; path=/; max-age=900`

          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              tenantSlug,
            },
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false })
        }
      },

      logout: async () => {
        const { token, user } = get()
        if (token) {
          try {
            await fetch(`${API_URL}/auth/logout`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Tenant-Slug": user?.tenantSlug ?? "",
              },
              credentials: "include",
            })
          } catch {
            // Ignore logout errors
          }
        }
        document.cookie = "opsaura-auth=; path=/; max-age=0"
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "opsaura-auth",
      partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),
    }
  )
)
