import { create } from "zustand"

export type NotificationSeverity = "critical" | "warning" | "info" | "success"

export interface AppNotification {
  id: string
  title: string
  message: string
  severity: NotificationSeverity
  read: boolean
  createdAt: Date
  href?: string
}

interface NotificationState {
  notifications: AppNotification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (n: Omit<AppNotification, "id" | "read" | "createdAt">) => void
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    title: "Critical Alert Fired",
    message: "DB-PROD-01: Connection pool exhausted on tenant_csx",
    severity: "critical",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    href: "/alerts/active",
  },
  {
    id: "2",
    title: "Escalation Triggered",
    message: "Alert #4821 escalated to L2 after 15 min without ACK",
    severity: "warning",
    read: false,
    createdAt: new Date(Date.now() - 8 * 60 * 1000),
    href: "/escalations/policies",
  },
  {
    id: "3",
    title: "War Room Opened",
    message: "War Room #WR-089 created for API latency incident",
    severity: "warning",
    read: false,
    createdAt: new Date(Date.now() - 22 * 60 * 1000),
    href: "/war-rooms/active",
  },
  {
    id: "4",
    title: "OnCall Schedule Updated",
    message: "Ravi Reddy added override for 2026-06-05",
    severity: "info",
    read: true,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    href: "/oncall/overrides",
  },
  {
    id: "5",
    title: "Alert Resolved",
    message: "Alert #4819 resolved by Priya Nair",
    severity: "success",
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    href: "/alerts/history",
  },
]

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length }
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  addNotification: (n) =>
    set((state) => {
      const notification: AppNotification = {
        ...n,
        id: crypto.randomUUID(),
        read: false,
        createdAt: new Date(),
      }
      const notifications = [notification, ...state.notifications]
      return { notifications, unreadCount: notifications.filter((x) => !x.read).length }
    }),
}))
