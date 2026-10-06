import type { Metadata } from "next"
import { EmailConfigPanel } from "@/components/notifications/email/email-config"
import { DeliveryLog } from "@/components/notifications/delivery-log"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = { title: "Email Notifications — OpsAura" }

export default function EmailNotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Email Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure SMTP and view email delivery logs.</p>
      </div>
      <EmailConfigPanel />
      <Separator />
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Delivery Log</h2>
        <DeliveryLog channelType="email" />
      </div>
    </div>
  )
}
