import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface GeneralSettings {
  companyName: string
  companyLogo: string
  timezone: string
  dateFormat: string
  language: string
}

export interface NotificationPreferences {
  alertVoiceEnabled: boolean
  alertVoiceThreshold: "critical" | "high" | "all"
  alertEmailEnabled: boolean
  alertSlackEnabled: boolean
  alertTeamsEnabled: boolean
  escalationVoiceEnabled: boolean
  escalationEmailEnabled: boolean
  digestEmailEnabled: boolean
  digestFrequency: "hourly" | "daily" | "weekly"
  quietHoursEnabled: boolean
  quietHoursStart: string
  quietHoursEnd: string
}

export interface SecuritySettings {
  mfaRequired: boolean
  sessionTimeoutMinutes: number
  passwordMinLength: number
  passwordRequireSpecial: boolean
  passwordRequireNumbers: boolean
  ipAllowlistEnabled: boolean
  ipAllowlist: string[]
}

export interface AlertSettings {
  autoCreateWarRoom: boolean
  autoCreateWarRoomThreshold: "critical" | "high"
  deduplicationWindowMinutes: number
  autoResolveAfterMinutes: number
  autoResolveEnabled: boolean
  defaultEscalationPolicyId: string
}

export interface SettingsState {
  general: GeneralSettings
  notifications: NotificationPreferences
  security: SecuritySettings
  alerts: AlertSettings
  updateGeneral: (patch: Partial<GeneralSettings>) => void
  updateNotifications: (patch: Partial<NotificationPreferences>) => void
  updateSecurity: (patch: Partial<SecuritySettings>) => void
  updateAlerts: (patch: Partial<AlertSettings>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      general: {
        companyName: "OpsAura",
        companyLogo: "",
        timezone: "Asia/Kolkata",
        dateFormat: "MMM DD, YYYY",
        language: "en",
      },
      notifications: {
        alertVoiceEnabled: true,
        alertVoiceThreshold: "critical",
        alertEmailEnabled: true,
        alertSlackEnabled: true,
        alertTeamsEnabled: false,
        escalationVoiceEnabled: true,
        escalationEmailEnabled: true,
        digestEmailEnabled: true,
        digestFrequency: "daily",
        quietHoursEnabled: false,
        quietHoursStart: "22:00",
        quietHoursEnd: "07:00",
      },
      security: {
        mfaRequired: false,
        sessionTimeoutMinutes: 480,
        passwordMinLength: 8,
        passwordRequireSpecial: true,
        passwordRequireNumbers: true,
        ipAllowlistEnabled: false,
        ipAllowlist: [],
      },
      alerts: {
        autoCreateWarRoom: true,
        autoCreateWarRoomThreshold: "critical",
        deduplicationWindowMinutes: 5,
        autoResolveEnabled: false,
        autoResolveAfterMinutes: 120,
        defaultEscalationPolicyId: "ep1",
      },
      updateGeneral: (patch) => set((s) => ({ general: { ...s.general, ...patch } })),
      updateNotifications: (patch) => set((s) => ({ notifications: { ...s.notifications, ...patch } })),
      updateSecurity: (patch) => set((s) => ({ security: { ...s.security, ...patch } })),
      updateAlerts: (patch) => set((s) => ({ alerts: { ...s.alerts, ...patch } })),
    }),
    { name: "opsaura-settings" }
  )
)
