import type { Metadata } from "next"
import { CoverageView } from "@/components/oncall/coverage/coverage-view"

export const metadata: Metadata = { title: "Coverage — OpsAura" }

export default function CoveragePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Coverage</h1>
        <p className="text-sm text-muted-foreground mt-1">Weekly view of who is on-call across all active schedules.</p>
      </div>
      <CoverageView />
    </div>
  )
}
