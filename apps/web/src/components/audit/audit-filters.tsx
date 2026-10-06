"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AuditCategory, AuditSeverity } from "@/store/audit-store"

const CATEGORIES: AuditCategory[] = [
  "auth", "user", "team", "service", "schedule", "oncall",
  "alert", "escalation", "war_room", "integration", "settings", "tenant",
]

export interface AuditFilterState {
  search: string
  category: string
  severity: string
}

interface Props {
  filters: AuditFilterState
  onChange: (f: AuditFilterState) => void
}

export function AuditFilters({ filters, onChange }: Props) {
  function set(field: keyof AuditFilterState, value: string) {
    onChange({ ...filters, [field]: value })
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-8" placeholder="Search events…" value={filters.search} onChange={(e) => set("search", e.target.value)} />
      </div>
      <Select value={filters.category} onValueChange={(v) => set("category", v)}>
        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.severity} onValueChange={(v) => set("severity", v)}>
        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severity</SelectItem>
          <SelectItem value="info">Info</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
