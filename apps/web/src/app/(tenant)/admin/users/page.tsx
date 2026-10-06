import type { Metadata } from "next"
import { UsersTable } from "@/components/organization/users/users-table"

export const metadata: Metadata = { title: "Users — OpsAura" }

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage user access and roles for your workspace.</p>
      </div>
      <UsersTable />
    </div>
  )
}
