"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SettingsSection } from "./settings-section"
import { useSettingsStore } from "@/store/settings-store"

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

export function SecuritySettings() {
  const { security, updateSecurity } = useSettingsStore()
  const [form, setForm] = useState({ ...security })
  const [newIp, setNewIp] = useState("")
  const [saved, setSaved] = useState(false)

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function addIp() {
    if (!newIp.trim()) return
    set("ipAllowlist", [...form.ipAllowlist, newIp.trim()])
    setNewIp("")
  }

  function removeIp(ip: string) {
    set("ipAllowlist", form.ipAllowlist.filter((x) => x !== ip))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateSecurity(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <SettingsSection title="Security" description="Enforce MFA, configure session timeout, password policy, and IP allowlisting.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="divide-y divide-border">
          <Toggle checked={form.mfaRequired} onChange={(v) => set("mfaRequired", v)} label="Require MFA for all users" />
          <Toggle checked={form.ipAllowlistEnabled} onChange={(v) => set("ipAllowlistEnabled", v)} label="IP Allowlist" />
        </div>

        {form.ipAllowlistEnabled && (
          <div className="flex flex-col gap-2 pl-2">
            <div className="flex gap-2">
              <Input className="flex-1" value={newIp} onChange={(e) => setNewIp(e.target.value)} placeholder="192.168.1.0/24 or 203.0.113.1" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIp())} />
              <Button type="button" size="sm" variant="outline" onClick={addIp}><Plus className="h-3.5 w-3.5" /></Button>
            </div>
            {form.ipAllowlist.map((ip) => (
              <div key={ip} className="flex items-center justify-between rounded-md border border-border px-3 py-1.5">
                <span className="text-xs font-mono text-foreground">{ip}</span>
                <button type="button" onClick={() => removeIp(ip)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
            {form.ipAllowlist.length === 0 && <p className="text-xs text-muted-foreground">No IPs added. All IPs are allowed.</p>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Session Timeout (minutes)</label>
            <Input type="number" min="30" max="1440" value={form.sessionTimeoutMinutes} onChange={(e) => set("sessionTimeoutMinutes", Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Min Password Length</label>
            <Input type="number" min="8" max="32" value={form.passwordMinLength} onChange={(e) => set("passwordMinLength", Number(e.target.value))} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-2">Password Requirements</p>
          <div className="divide-y divide-border">
            <Toggle checked={form.passwordRequireSpecial} onChange={(v) => set("passwordRequireSpecial", v)} label="Require special characters" />
            <Toggle checked={form.passwordRequireNumbers} onChange={(v) => set("passwordRequireNumbers", v)} label="Require numbers" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="sm">{saved ? "Saved!" : "Save Changes"}</Button>
        </div>
      </form>
    </SettingsSection>
  )
}
