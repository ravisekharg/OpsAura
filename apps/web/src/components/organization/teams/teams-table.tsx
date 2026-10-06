"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Users, Loader2 } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useOrganizationStore } from "@/store/organization-store"
import { TeamDialog } from "./team-dialog"

export function TeamsTable() {
  const { teams, isLoading, error, fetchTeams } = useOrganizationStore()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => { fetchTeams() }, [fetchTeams])

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search teams…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />New Team
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && teams.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center py-10"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-10">No teams found</TableCell></TableRow>
            )}
            {filtered.map((team) => {
              const leadName = team.lead?.name ?? "—"
              const memberCount = team._count?.members ?? team.members?.length ?? 0
              return (
                <TableRow key={team.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                        <Users className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium leading-none">{team.name}</p>
                        {team.description && <p className="text-xs text-muted-foreground mt-0.5">{team.description}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{leadName}</TableCell>
                  <TableCell className="text-muted-foreground">{memberCount}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(team.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <TeamDialog open={dialogOpen} onClose={() => { setDialogOpen(false); fetchTeams() }} />
    </div>
  )
}
