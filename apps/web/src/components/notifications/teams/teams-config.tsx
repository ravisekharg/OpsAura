"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNotificationChannelStore, type TeamsConfig } from "@/store/notification-channel-store"
import { ChannelStatusCard } from "../channel-status-card"

export function TeamsConfigPanel() {
  const { channels, saveConfig } = useNotificationChannelStore()
  const channel = channels.find((c) => c.id === "ch-teams")!
  const cfg = channel.config as TeamsConfig

  const [form, setForm] = useState<TeamsConfig>({ ...cfg })
  const [saved, setSaved] = useState(false)

  function set(field: keyof TeamsConfig, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    saveConfig("ch-teams", form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <ChannelStatusCard channel={channel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Incoming Webhook URL</label>
          <Input value={form.webhookUrl} onChange={(e) => set("webhookUrl", e.target.value)} placeholder="https://outlook.office.com/webhook/..." />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Azure Tenant ID</label>
          <Input value={form.tenantId} onChange={(e) => set("tenantId", e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
        </div>
        <p className="text-xs text-muted-foreground">
          Generate the webhook URL from the Teams channel connector settings. Paste the full URL above.
        </p>
        <div className="flex justify-end">
          <Button type="submit" size="sm">{saved ? "Saved!" : "Save Configuration"}</Button>
        </div>
      </form>
    </ChannelStatusCard>
  )
}
