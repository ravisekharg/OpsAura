import type { Metadata } from "next"
import { EscalationsTable } from "@/components/escalations/escalations-table"

export const metadata: Metadata = { title: "Customer Escalations — OpsAura" }

export default function CustomerEscalationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Customer Escalations</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and manage escalations raised by or affecting customers.</p>
      </div>
      <EscalationsTable type="customer" />
    </div>
  )
}
