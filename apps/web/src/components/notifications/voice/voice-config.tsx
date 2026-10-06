"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotificationChannelStore, type VoiceConfig } from "@/store/notification-channel-store"
import { ChannelStatusCard } from "../channel-status-card"

const PROVIDERS = ["Twilio", "Vonage", "AWS Connect", "Plivo"]

export function VoiceConfigPanel() {
  const { channels, saveConfig } = useNotificationChannelStore()
  const channel = channels.find((c) => c.id === "ch-voice")!
  const cfg = channel.config as VoiceConfig

  const [form, setForm] = useState<VoiceConfig>({ ...cfg })
  const [saved, setSaved] = useState(false)

  function set(field: keyof VoiceConfig, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    saveConfig("ch-voice", form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <ChannelStatusCard channel={channel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Voice Provider</label>
          <Select value={form.provider} onValueChange={(v) => set("provider", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{PROVIDERS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Account SID</label>
            <Input value={form.accountSid} onChange={(e) => set("accountSid", e.target.value)} placeholder="ACxxxxxxxxxxxxxxxx" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Auth Token</label>
            <Input type="password" value={form.authToken} onChange={(e) => set("authToken", e.target.value)} placeholder="••••••••" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">From Number</label>
            <Input value={form.fromNumber} onChange={(e) => set("fromNumber", e.target.value)} placeholder="+14155552671" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Callback URL</label>
            <Input value={form.callbackUrl} onChange={(e) => set("callbackUrl", e.target.value)} placeholder="https://opsaura.io/api/voice/callback" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm">{saved ? "Saved!" : "Save Configuration"}</Button>
        </div>
      </form>
    </ChannelStatusCard>
  )
}
