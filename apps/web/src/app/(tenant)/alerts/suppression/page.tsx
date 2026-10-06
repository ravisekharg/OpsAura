import type { Metadata } from "next"
import { SuppressionRulesTable } from "@/components/alerts/suppression/suppression-rules-table"

export const metadata: Metadata = { title: "Suppression Rules — OpsAura" }

export default function SuppressionRulesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Suppression Rules</h1>
        <p className="text-sm text-muted-foreground mt-1">Silence known alerts during maintenance windows or acknowledged outages.</p>
      </div>
      <SuppressionRulesTable />
    </div>
  )
}
