import type { Metadata } from "next"
import { CorrelationRulesTable } from "@/components/alerts/correlation/correlation-rules-table"

export const metadata: Metadata = { title: "Correlation Rules — OpsAura" }

export default function CorrelationRulesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Correlation Rules</h1>
        <p className="text-sm text-muted-foreground mt-1">Group related alerts into a single correlated incident.</p>
      </div>
      <CorrelationRulesTable />
    </div>
  )
}
