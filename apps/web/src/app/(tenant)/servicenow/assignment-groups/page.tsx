import type { Metadata } from "next"
import { AssignmentGroupsMapping } from "@/components/servicenow/assignment-groups-mapping"

export const metadata: Metadata = { title: "ServiceNow Assignment Groups — OpsAura" }

export default function ServiceNowAssignmentGroupsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Assignment Groups</h1>
        <p className="text-sm text-muted-foreground mt-1">Map ServiceNow assignment groups to OpsAura groups for automatic alert routing.</p>
      </div>
      <AssignmentGroupsMapping />
    </div>
  )
}
