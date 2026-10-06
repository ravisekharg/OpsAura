import type { Metadata } from "next"
import { RotationsTable } from "@/components/oncall/rotations/rotations-table"

export const metadata: Metadata = { title: "Rotations — OpsAura" }

export default function RotationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Rotations</h1>
        <p className="text-sm text-muted-foreground mt-1">Define rotation members, type, and handoff schedule.</p>
      </div>
      <RotationsTable />
    </div>
  )
}
