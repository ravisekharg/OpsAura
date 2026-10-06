import Link from "next/link"
import { ExternalLink, CheckCircle2, XCircle } from "lucide-react"
import { SettingsSection } from "./settings-section"

const INTEGRATIONS = [
  { name: "ServiceNow", description: "Sync incidents and assignment groups", href: "/servicenow/connections", connected: true },
  { name: "Slack", description: "Send alert and escalation notifications", href: "/notifications/slack", connected: true },
  { name: "Microsoft Teams", description: "Send notifications to Teams channels", href: "/notifications/teams", connected: false },
  { name: "Email (SMTP)", description: "Send alert emails and digests", href: "/notifications/email", connected: true },
  { name: "Voice Calls", description: "Automated voice calls for critical alerts", href: "/notifications/voice", connected: true },
  { name: "Jira Service Management", description: "Sync incidents with Jira", href: "#", connected: false },
  { name: "Zoom", description: "Auto-create Zoom meetings for War Rooms", href: "#", connected: false },
  { name: "Webex", description: "Auto-create Webex meetings for War Rooms", href: "#", connected: false },
  { name: "Tailscale", description: "Secure network access for on-call engineers", href: "#", connected: false },
]

export function IntegrationsSettings() {
  return (
    <SettingsSection title="Integrations" description="Connect OpsAura to third-party tools. Click Configure to set up each integration.">
      <div className="flex flex-col divide-y divide-border">
        {INTEGRATIONS.map((integration) => (
          <div key={integration.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              {integration.connected
                ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                : <XCircle className="h-4 w-4 text-muted-foreground/40 shrink-0" />}
              <div>
                <p className="text-sm font-medium text-foreground">{integration.name}</p>
                <p className="text-xs text-muted-foreground">{integration.description}</p>
              </div>
            </div>
            <Link
              href={integration.href}
              className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
            >
              Configure <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>
    </SettingsSection>
  )
}
