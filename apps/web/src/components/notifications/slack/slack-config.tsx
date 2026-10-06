"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNotificationChannelStore, type SlackConfig } from "@/store/notification-channel-store"
import { ChannelStatusCard } from "../channel-status-card"

export function SlackConfigPanel() {
  const { channels, saveConfig } = useNotificationChannelStore()
  const channel = channels.find((c) => c.id === "ch-slack")!
  const cfg = channel.config as SlackConfig

  const [form, setForm] = useState<SlackConfig>({ ...cfg })
  const [saved, setSaved] = useState(false)

  function set(field: keyof SlackConfig, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    saveConfig("ch-slack", form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <ChannelStatusCard channel={channel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Incoming Webhook URL</label>
          <Input value={form.webhookUrl} onChange={(e) => set("webhookUrl", e.target.value)} placeholder="https://hooks.slack.com/services/..." />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Default Channel</label>
          <Input value={form.defaultChannel} onChange={(e) => set("defaultChannel", e.target.value)} placeholder="#ops-alerts" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Bot Token</label>
            <Input type="password" value={form.botToken} onChange={(e) => set("botToken", e.target.value)} placeholder="xoxb-..." />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Signing Secret</label>
            <Input type="password" value={form.signingSecret} onChange={(e) => set("signingSecret", e.target.value)} placeholder="••••••••" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm">{saved ? "Saved!" : "Save Configuration"}</Button>
        </div>
      </form>
    </ChannelStatusCard>
  )
}
