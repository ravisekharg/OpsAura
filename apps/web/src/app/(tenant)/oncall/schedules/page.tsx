import type { Metadata } from "next"
import { SchedulesTable } from "@/components/oncall/schedules/schedules-table"

export const metadata: Metadata = { title: "Schedules — OpsAura" }

export default function SchedulesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Schedules</h1>
        <p className="text-sm text-muted-foreground mt-1">On-call schedules group rotations and define timezone and team ownership.</p>
      </div>
      <SchedulesTable />
    </div>
  )
}
