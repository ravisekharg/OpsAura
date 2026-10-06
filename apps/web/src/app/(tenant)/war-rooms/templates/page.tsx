import type { Metadata } from "next"
import { TemplatesTable } from "@/components/war-rooms/templates-table"

export const metadata: Metadata = { title: "War Room Templates — OpsAura" }

export default function WarRoomTemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">War Room Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">Pre-built runbooks with default participants and action items for common incident types.</p>
      </div>
      <TemplatesTable />
    </div>
  )
}
