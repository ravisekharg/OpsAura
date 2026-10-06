import { create } from "zustand"

export type ChannelType = "email" | "slack" | "teams" | "voice"
export type DeliveryStatus = "sent" | "failed" | "pending" | "delivered"

export interface EmailConfig {
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPassword: string
  fromAddress: string
  fromName: string
  useTLS: boolean
}

export interface SlackConfig {
  webhookUrl: string
  defaultChannel: string
  botToken: string
  signingSecret: string
}

export interface TeamsConfig {
  webhookUrl: string
  tenantId: string
}

export interface VoiceConfig {
  provider: string
  accountSid: string
  authToken: string
  fromNumber: string
  callbackUrl: string
}

export interface NotificationChannel {
  id: string
  type: ChannelType
  name: string
  connected: boolean
  config: EmailConfig | SlackConfig | TeamsConfig | VoiceConfig
  updatedAt: Date
}

export interface NotificationDelivery {
  id: string
  channelType: ChannelType
  recipient: string
  subject: string
  status: DeliveryStatus
  alertId?: string
  escalationId?: string
  errorMessage?: string
  sentAt: Date
}

interface NotificationChannelState {
  channels: NotificationChannel[]
  deliveries: NotificationDelivery[]
  updateChannel: (id: string, patch: Partial<NotificationChannel>) => void
  saveConfig: (id: string, config: NotificationChannel["config"]) => void
}

const now = new Date()
const minsAgo = (m: number) => new Date(now.getTime() - m * 60000)

const MOCK_CHANNELS: NotificationChannel[] = [
  {
    id: "ch-email", type: "email", name: "SMTP Email", connected: true,
    config: { smtpHost: "smtp.opsaura.io", smtpPort: "587", smtpUser: "alerts@opsaura.io", smtpPassword: "", fromAddress: "alerts@opsaura.io", fromName: "OpsAura Alerts", useTLS: true } as EmailConfig,
    updatedAt: new Date("2025-02-01"),
  },
  {
    id: "ch-slack", type: "slack", name: "Slack", connected: true,
    config: { webhookUrl: "https://hooks.slack.com/services/xxx/yyy/zzz", defaultChannel: "#ops-alerts", botToken: "", signingSecret: "" } as SlackConfig,
    updatedAt: new Date("2025-02-10"),
  },
  {
    id: "ch-teams", type: "teams", name: "Microsoft Teams", connected: false,
    config: { webhookUrl: "", tenantId: "" } as TeamsConfig,
    updatedAt: new Date("2025-02-15"),
  },
  {
    id: "ch-voice", type: "voice", name: "Voice Calls", connected: true,
    config: { provider: "Twilio", accountSid: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", authToken: "", fromNumber: "+14155552671", callbackUrl: "https://opsaura.io/api/voice/callback" } as VoiceConfig,
    updatedAt: new Date("2025-03-01"),
  },
]

const MOCK_DELIVERIES: NotificationDelivery[] = [
  { id: "d1", channelType: "voice", recipient: "+919876543210", subject: "Critical: DB connection pool exhausted", status: "delivered", alertId: "a1", sentAt: minsAgo(10) },
  { id: "d2", channelType: "slack", recipient: "#ops-alerts", subject: "Critical: DB connection pool exhausted", status: "delivered", alertId: "a1", sentAt: minsAgo(10) },
  { id: "d3", channelType: "email", recipient: "ravi.reddy@opsaura.io", subject: "Alert: API p99 latency > 2s", status: "delivered", alertId: "a2", sentAt: minsAgo(23) },
  { id: "d4", channelType: "voice", recipient: "+919876543211", subject: "High: API p99 latency > 2s", status: "sent", alertId: "a2", sentAt: minsAgo(24) },
  { id: "d5", channelType: "teams", recipient: "#incidents", subject: "Escalation: Payment gateway down", status: "failed", escalationId: "esc1", errorMessage: "Webhook URL not configured", sentAt: minsAgo(44) },
  { id: "d6", channelType: "email", recipient: "priya.nair@opsaura.io", subject: "Escalation: Payment gateway down — CSX", status: "delivered", escalationId: "esc1", sentAt: minsAgo(43) },
  { id: "d7", channelType: "slack", recipient: "#payments-oncall", subject: "Resolved: Notification queue lag", status: "delivered", alertId: "a6", sentAt: minsAgo(120) },
  { id: "d8", channelType: "voice", recipient: "+919876543212", subject: "High: Memory usage > 90%", status: "failed", alertId: "a7", errorMessage: "Call not answered after 3 attempts", sentAt: minsAgo(355) },
]

export const useNotificationChannelStore = create<NotificationChannelState>((set) => ({
  channels: MOCK_CHANNELS,
  deliveries: MOCK_DELIVERIES,

  updateChannel: (id, patch) =>
    set((s) => ({ channels: s.channels.map((c) => c.id === id ? { ...c, ...patch, updatedAt: new Date() } : c) })),

  saveConfig: (id, config) =>
    set((s) => ({ channels: s.channels.map((c) => c.id === id ? { ...c, config, connected: true, updatedAt: new Date() } : c) })),
}))
