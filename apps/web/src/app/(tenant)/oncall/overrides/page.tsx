import type { Metadata } from "next"
import { OverridesTable } from "@/components/oncall/overrides/overrides-table"

export const metadata: Metadata = { title: "Overrides — OpsAura" }

export default function OverridesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Overrides</h1>
        <p className="text-sm text-muted-foreground mt-1">Temporarily swap on-call coverage for leave, holidays, or conferences.</p>
      </div>
      <OverridesTable />
    </div>
  )
}
