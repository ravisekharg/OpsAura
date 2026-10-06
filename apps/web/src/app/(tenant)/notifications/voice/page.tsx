import type { Metadata } from "next"
import { VoiceConfigPanel } from "@/components/notifications/voice/voice-config"
import { DeliveryLog } from "@/components/notifications/delivery-log"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = { title: "Voice Notifications — OpsAura" }

export default function VoiceNotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Voice Call Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure voice provider and view call delivery logs.</p>
      </div>
      <VoiceConfigPanel />
      <Separator />
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Delivery Log</h2>
        <DeliveryLog channelType="voice" />
      </div>
    </div>
  )
}
