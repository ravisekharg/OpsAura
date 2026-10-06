"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { SettingsSection } from "./settings-section"
import { useSettingsStore } from "@/store/settings-store"

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-foreground">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
      >
        <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  )
}

export function NotificationSettings() {
  const { notifications, updateNotifications } = useSettingsStore()
  const [form, setForm] = useState({ ...notifications })
  const [saved, setSaved] = useState(false)

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateNotifications(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <SettingsSection title="Notifications" description="Control which channels are used for alert and escalation notifications and configure quiet hours.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Alert Channels</p>
          <div className="divide-y divide-border">
            <Toggle checked={form.alertVoiceEnabled} onChange={(v) => set("alertVoiceEnabled", v)} label="Voice Calls" />
            {form.alertVoiceEnabled && (
              <div className="py-2 pl-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Call for</span>
                  <Select value={form.alertVoiceThreshold} onValueChange={(v) => set("alertVoiceThreshold", v as typeof form.alertVoiceThreshold)}>
                    <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical only</SelectItem>
                      <SelectItem value="high">High & above</SelectItem>
                      <SelectItem value="all">All alerts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <Toggle checked={form.alertEmailEnabled} onChange={(v) => set("alertEmailEnabled", v)} label="Email" />
            <Toggle checked={form.alertSlackEnabled} onChange={(v) => set("alertSlackEnabled", v)} label="Slack" />
            <Toggle checked={form.alertTeamsEnabled} onChange={(v) => set("alertTeamsEnabled", v)} label="Microsoft Teams" />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Escalation Channels</p>
          <div className="divide-y divide-border">
            <Toggle checked={form.escalationVoiceEnabled} onChange={(v) => set("escalationVoiceEnabled", v)} label="Voice Calls on Escalation" />
            <Toggle checked={form.escalationEmailEnabled} onChange={(v) => set("escalationEmailEnabled", v)} label="Email on Escalation" />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Digest</p>
          <div className="divide-y divide-border">
            <Toggle checked={form.digestEmailEnabled} onChange={(v) => set("digestEmailEnabled", v)} label="Email Digest" />
            {form.digestEmailEnabled && (
              <div className="py-2 pl-4 flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Frequency</span>
                <Select value={form.digestFrequency} onValueChange={(v) => set("digestFrequency", v as typeof form.digestFrequency)}>
                  <SelectTrigger className="h-7 w-28 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quiet Hours</p>
          <div className="divide-y divide-border">
            <Toggle checked={form.quietHoursEnabled} onChange={(v) => set("quietHoursEnabled", v)} label="Enable Quiet Hours (no voice calls)" />
            {form.quietHoursEnabled && (
              <div className="py-2 pl-4 flex items-center gap-3">
                <span className="text-xs text-muted-foreground">From</span>
                <Input type="time" className="h-7 w-24 text-xs" value={form.quietHoursStart} onChange={(e) => set("quietHoursStart", e.target.value)} />
                <span className="text-xs text-muted-foreground">to</span>
                <Input type="time" className="h-7 w-24 text-xs" value={form.quietHoursEnd} onChange={(e) => set("quietHoursEnd", e.target.value)} />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm">{saved ? "Saved!" : "Save Changes"}</Button>
        </div>
      </form>
    </SettingsSection>
  )
}
