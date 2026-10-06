import type { Metadata } from "next"
import { AuditStats } from "@/components/audit/audit-stats"
import { AuditTable } from "@/components/audit/audit-table"

export const metadata: Metadata = { title: "Audit Center — OpsAura" }

export default function AuditPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Audit Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete tamper-evident log of all user and system actions.</p>
      </div>
      <AuditStats />
      <AuditTable />
    </div>
  )
}
