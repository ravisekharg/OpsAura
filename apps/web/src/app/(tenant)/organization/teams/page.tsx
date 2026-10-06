import type { Metadata } from "next"
import { TeamsTable } from "@/components/organization/teams/teams-table"

export const metadata: Metadata = { title: "Teams — OpsAura" }

export default function TeamsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Teams</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage teams and their members.</p>
      </div>
      <TeamsTable />
    </div>
  )
}
