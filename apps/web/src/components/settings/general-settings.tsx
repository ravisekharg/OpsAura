"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SettingsSection } from "./settings-section"
import { useSettingsStore } from "@/store/settings-store"

const TIMEZONES = ["Asia/Kolkata", "US/Eastern", "US/Pacific", "US/Central", "Europe/London", "Europe/Paris", "Asia/Singapore", "Australia/Sydney", "UTC"]
const DATE_FORMATS = ["MMM DD, YYYY", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]

export function GeneralSettings() {
  const { general, updateGeneral } = useSettingsStore()
  const [form, setForm] = useState({ ...general })
  const [saved, setSaved] = useState(false)

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateGeneral(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <SettingsSection title="General" description="Basic workspace settings including name, timezone, and display preferences.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">Company Name</label>
          <Input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Your Company" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Timezone</label>
            <Select value={form.timezone} onValueChange={(v) => set("timezone", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Date Format</label>
            <Select value={form.dateFormat} onValueChange={(v) => set("dateFormat", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DATE_FORMATS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm">{saved ? "Saved!" : "Save Changes"}</Button>
        </div>
      </form>
    </SettingsSection>
  )
}
