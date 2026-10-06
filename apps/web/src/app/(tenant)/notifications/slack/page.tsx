import type { Metadata } from "next"
import { SlackConfigPanel } from "@/components/notifications/slack/slack-config"
import { DeliveryLog } from "@/components/notifications/delivery-log"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = { title: "Slack Notifications — OpsAura" }

export default function SlackNotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Slack Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Connect Slack and view message delivery logs.</p>
      </div>
      <SlackConfigPanel />
      <Separator />
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Delivery Log</h2>
        <DeliveryLog channelType="slack" />
      </div>
    </div>
  )
}
