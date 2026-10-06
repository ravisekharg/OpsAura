import type { Metadata } from "next"
import { PoliciesTable } from "@/components/escalations/policies/policies-table"

export const metadata: Metadata = { title: "Escalation Policies — OpsAura" }

export default function EscalationPoliciesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Escalation Policies</h1>
        <p className="text-sm text-muted-foreground mt-1">Define multi-step escalation chains with delays, conditions, and notification channels.</p>
      </div>
      <PoliciesTable />
    </div>
  )
}
