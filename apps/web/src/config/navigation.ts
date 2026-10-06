import {
  LayoutDashboard,
  Bell,
  Clock,
  GitBranch,
  MessageSquare,
  Users,
  Link2,
  Building2,
  ShieldCheck,
  Activity,
} from "lucide-react"
import type { NavSection } from "@/types/navigation"

export const navigation: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Alerts",
        href: "/alerts",
        icon: Bell,
        children: [
          { label: "Active Alerts", href: "/alerts/active" },
          { label: "Alert History", href: "/alerts/history" },
          { label: "Correlation Rules", href: "/alerts/correlation" },
          { label: "Suppression Rules", href: "/alerts/suppression" },
        ],
      },
      {
        label: "OnCall",
        href: "/oncall",
        icon: Clock,
        children: [
          { label: "Schedules", href: "/oncall/schedules" },
          { label: "Rotations", href: "/oncall/rotations" },
          { label: "Overrides", href: "/oncall/overrides" },
          { label: "Coverage", href: "/oncall/coverage" },
        ],
      },
      {
        label: "Escalations",
        href: "/escalations",
        icon: GitBranch,
        children: [
          { label: "Policies", href: "/escalations/policies" },
          { label: "Customer Escalations", href: "/escalations/customer" },
          { label: "Vendor Escalations", href: "/escalations/vendor" },
        ],
      },
      {
        label: "Notifications",
        href: "/notifications",
        icon: MessageSquare,
        children: [
          { label: "Email", href: "/notifications/email" },
          { label: "Teams", href: "/notifications/teams" },
          { label: "Slack", href: "/notifications/slack" },
          { label: "Voice", href: "/notifications/voice" },
        ],
      },
      {
        label: "War Rooms",
        href: "/war-rooms",
        icon: Users,
        children: [
          { label: "Active", href: "/war-rooms/active" },
          { label: "History", href: "/war-rooms/history" },
          { label: "Templates", href: "/war-rooms/templates" },
        ],
      },
    ],
  },
  {
    label: "Integrations",
    items: [
      {
        label: "ServiceNow",
        href: "/servicenow",
        icon: Link2,
        children: [
          { label: "Connections", href: "/servicenow/connections" },
          { label: "Assignment Groups", href: "/servicenow/assignment-groups" },
          { label: "Sync Logs", href: "/servicenow/sync-logs" },
        ],
      },
    ],
  },
  {
    label: "Organization",
    items: [
      {
        label: "Organization",
        href: "/organization",
        icon: Building2,
        children: [
          { label: "Teams", href: "/organization/teams" },
          { label: "Services", href: "/organization/services" },
          { label: "Service Ownership", href: "/organization/service-ownership" },
          { label: "Assignment Groups", href: "/organization/assignment-groups" },
        ],
      },
      {
        label: "Administration",
        href: "/admin",
        icon: ShieldCheck,
        children: [
          { label: "Users", href: "/admin/users" },
          { label: "Roles", href: "/admin/roles" },
          { label: "Audit", href: "/admin/audit" },
          { label: "System Health", href: "/admin/system-health" },
          { label: "Settings", href: "/admin/settings" },
        ],
      },
    ],
  },
]
