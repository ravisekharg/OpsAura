import type { Metadata } from "next"
import { AssignmentGroupsTable } from "@/components/organization/assignment-groups/assignment-groups-table"
import { RoutingRulesTable } from "@/components/organization/routing-rules/routing-rules-table"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = { title: "Assignment Routing — OpsAura" }

export default function AssignmentGroupsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Assignment Routing</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure assignment groups and routing rules that direct alerts to the right on-call team.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Assignment Groups</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Groups link teams, services, and on-call policies together.</p>
        </div>
        <AssignmentGroupsTable />
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Routing Rules</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Rules determine which assignment group receives an incoming alert.</p>
        </div>
        <RoutingRulesTable />
      </div>
    </div>
  )
}
