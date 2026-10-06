import type { Metadata } from "next"
import { EscalationsTable } from "@/components/escalations/escalations-table"

export const metadata: Metadata = { title: "Vendor Escalations — OpsAura" }

export default function VendorEscalationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Vendor Escalations</h1>
        <p className="text-sm text-muted-foreground mt-1">Track escalations raised with third-party vendors and cloud providers.</p>
      </div>
      <EscalationsTable type="vendor" />
    </div>
  )
}
