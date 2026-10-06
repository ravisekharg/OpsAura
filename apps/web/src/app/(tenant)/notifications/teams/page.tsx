import type { Metadata } from "next"
import { TeamsConfigPanel } from "@/components/notifications/teams/teams-config"
import { DeliveryLog } from "@/components/notifications/delivery-log"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = { title: "Teams Notifications — OpsAura" }

export default function TeamsNotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Microsoft Teams Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure Teams webhook and view delivery logs.</p>
      </div>
      <TeamsConfigPanel />
      <Separator />
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Delivery Log</h2>
        <DeliveryLog channelType="teams" />
      </div>
    </div>
  )
}
