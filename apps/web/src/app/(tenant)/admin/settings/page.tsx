import type { Metadata } from "next"
import { GeneralSettings } from "@/components/settings/general-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { AlertSettings } from "@/components/settings/alert-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { IntegrationsSettings } from "@/components/settings/integrations-settings"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = { title: "Settings — OpsAura" }

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your workspace configuration, notification preferences, and security policies.</p>
      </div>

      <GeneralSettings />
      <Separator />
      <NotificationSettings />
      <Separator />
      <AlertSettings />
      <Separator />
      <SecuritySettings />
      <Separator />
      <IntegrationsSettings />
    </div>
  )
}
