import type { Metadata } from "next"
import { RolesTable } from "@/components/admin/roles/roles-table"

export const metadata: Metadata = { title: "Roles — OpsAura" }

export default function RolesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Roles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          System roles and their permission sets. System roles cannot be deleted.
        </p>
      </div>
      <RolesTable />
    </div>
  )
}
