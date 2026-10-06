import type { Metadata } from "next"
import { OwnershipTable } from "@/components/organization/service-ownership/ownership-table"

export const metadata: Metadata = { title: "Service Ownership — OpsAura" }

export default function ServiceOwnershipPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Service Ownership</h1>
        <p className="text-sm text-muted-foreground mt-1">Maps each service to its owning team, primary/secondary owners, and assignment group.</p>
      </div>
      <OwnershipTable />
    </div>
  )
}
