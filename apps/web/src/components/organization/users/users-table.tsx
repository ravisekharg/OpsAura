"use client"

import { useEffect, useState } from "react"
import { UserPlus, Search, Loader2 } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useOrganizationStore } from "@/store/organization-store"
import { InviteUserDialog } from "./invite-user-dialog"

const statusVariant: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
  ACTIVE: "success", INVITED: "warning", INACTIVE: "secondary", SUSPENDED: "destructive",
}

export function UsersTable() {
  const { users, isLoading, error, fetchUsers } = useOrganizationStore()
  const [search, setSearch] = useState("")
  const [inviteOpen, setInviteOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    const t = setTimeout(() => fetchUsers({ search }), 300)
    return () => clearTimeout(t)
  }, [search])

  const filtered = users

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-4 w-4 mr-1.5" />Invite User
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  No users found
                </TableCell>
              </TableRow>
            )}
            {filtered.map((user) => {
              const roleName = typeof user.role === "object" ? user.role.name : user.role
              const teams = user.teamMemberships?.map((m) => m.team.name) ?? []
              const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">
                          {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-none">{user.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground capitalize">
                    {roleName.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teams.length === 0
                        ? <span className="text-muted-foreground text-xs">—</span>
                        : teams.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[user.status] ?? "secondary"}>
                      {user.status.charAt(0) + user.status.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{joinedDate}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <InviteUserDialog open={inviteOpen} onClose={() => { setInviteOpen(false); fetchUsers() }} />
    </div>
  )
}
