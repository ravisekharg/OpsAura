"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNotificationChannelStore, type EmailConfig } from "@/store/notification-channel-store"
import { ChannelStatusCard } from "../channel-status-card"

export function EmailConfigPanel() {
  const { channels, saveConfig } = useNotificationChannelStore()
  const channel = channels.find((c) => c.id === "ch-email")!
  const cfg = channel.config as EmailConfig

  const [form, setForm] = useState<EmailConfig>({ ...cfg })
  const [saved, setSaved] = useState(false)

  function set(field: keyof EmailConfig, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    saveConfig("ch-email", form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <ChannelStatusCard channel={channel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">SMTP Host</label>
            <Input value={form.smtpHost} onChange={(e) => set("smtpHost", e.target.value)} placeholder="smtp.example.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">SMTP Port</label>
            <Input value={form.smtpPort} onChange={(e) => set("smtpPort", e.target.value)} placeholder="587" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">SMTP Username</label>
            <Input value={form.smtpUser} onChange={(e) => set("smtpUser", e.target.value)} placeholder="alerts@company.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">SMTP Password</label>
            <Input type="password" value={form.smtpPassword} onChange={(e) => set("smtpPassword", e.target.value)} placeholder="••••••••" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">From Address</label>
            <Input value={form.fromAddress} onChange={(e) => set("fromAddress", e.target.value)} placeholder="alerts@opsaura.io" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">From Name</label>
            <Input value={form.fromName} onChange={(e) => set("fromName", e.target.value)} placeholder="OpsAura Alerts" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="tls" checked={form.useTLS} onChange={(e) => set("useTLS", e.target.checked)} className="h-4 w-4 rounded border-input" />
          <label htmlFor="tls" className="text-xs font-medium">Use TLS / STARTTLS</label>
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm">{saved ? "Saved!" : "Save Configuration"}</Button>
        </div>
      </form>
    </ChannelStatusCard>
  )
}
