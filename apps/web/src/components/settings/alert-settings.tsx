"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SettingsSection } from "./settings-section"
import { useSettingsStore } from "@/store/settings-store"
import { useEscalationStore } from "@/store/escalation-store"

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-foreground">{label}</span>
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
        <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  )
}

export function AlertSettings() {
  const { alerts, updateAlerts } = useSettingsStore()
  const policies = useEscalationStore((s) => s.policies)
  const [form, setForm] = useState({ ...alerts })
  const [saved, setSaved] = useState(false)

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateAlerts(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <SettingsSection title="Alert Behaviour" description="Configure deduplication, auto war room creation, auto resolve, and default escalation policy.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="divide-y divide-border">
          <Toggle checked={form.autoCreateWarRoom} onChange={(v) => set("autoCreateWarRoom", v)} label="Auto-create War Room on critical alerts" />
          {form.autoCreateWarRoom && (
            <div className="py-2 pl-4 flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Threshold</span>
              <Select value={form.autoCreateWarRoomThreshold} onValueChange={(v) => set("autoCreateWarRoomThreshold", v as typeof form.autoCreateWarRoomThreshold)}>
                <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical only</SelectItem>
                  <SelectItem value="high">High & above</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <Toggle checked={form.autoResolveEnabled} onChange={(v) => set("autoResolveEnabled", v)} label="Auto-resolve alerts after inactivity" />
          {form.autoResolveEnabled && (
            <div className="py-2 pl-4 flex items-center gap-3">
              <span className="text-xs text-muted-foreground">After</span>
              <Input type="number" min="30" max="1440" className="h-7 w-20 text-xs" value={form.autoResolveAfterMinutes} onChange={(e) => set("autoResolveAfterMinutes", Number(e.target.value))} />
              <span className="text-xs text-muted-foreground">minutes</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Deduplication Window</label>
          <div className="flex items-center gap-2">
            <Input type="number" min="1" max="60" className="w-20" value={form.deduplicationWindowMinutes} onChange={(e) => set("deduplicationWindowMinutes", Number(e.target.value))} />
            <span className="text-xs text-muted-foreground">minutes — duplicate alerts within this window are merged</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Default Escalation Policy</label>
          <Select value={form.defaultEscalationPolicyId} onValueChange={(v) => set("defaultEscalationPolicyId", v)}>
            <SelectTrigger><SelectValue placeholder="Select policy" /></SelectTrigger>
            <SelectContent>{policies.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm">{saved ? "Saved!" : "Save Changes"}</Button>
        </div>
      </form>
    </SettingsSection>
  )
}
