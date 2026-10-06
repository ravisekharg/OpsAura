"use client"

import { useEffect, useState } from "react"
import { Plus, Loader2, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { platformApi } from "@/lib/platform-api"

interface PlatformUserRecord { id: string; email: string; name: string; role: string; active: boolean; createdAt: string }

const roleVariant: Record<string, any> = {
  SUPER_ADMIN: "destructive", ADMIN: "warning", SUPPORT_ADMIN: "secondary", BILLING_ADMIN: "secondary", READ_ONLY: "outline",
}

export default function PlatformUsersPage() {
  const [users, setUsers] = useState<PlatformUserRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Platform users endpoint — reads from platform_db
    platformApi.get<{ data: PlatformUserRecord[] }>("/platform/users")
      .then((r) => setUsers(r.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Platform Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Admins with access to this platform control plane.</p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-start gap-2">
        <Shield className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-600 dark:text-amber-400">
          <p className="font-semibold mb-0.5">Platform users are separate from tenant users.</p>
          <p>They have access to the entire platform and all tenant data. Manage with caution.</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={4} className="text-center py-12"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>}
            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <p className="text-sm text-muted-foreground">Platform Users API not yet available.</p>
                  <p className="text-xs text-muted-foreground mt-1">Currently logged in admin: platform@opsaura.io</p>
                </TableCell>
              </TableRow>
            )}
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </TableCell>
                <TableCell><Badge variant={roleVariant[u.role] ?? "secondary"} className="text-xs capitalize">{u.role.replace(/_/g, " ").toLowerCase()}</Badge></TableCell>
                <TableCell><Badge variant={u.active ? "success" : "secondary"}>{u.active ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
