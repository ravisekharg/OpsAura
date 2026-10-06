"use client"

import { useEffect, useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useOrganizationStore } from "@/store/organization-store"

const tierVariant: Record<string, "destructive" | "warning" | "secondary" | "outline"> = {
  P0: "destructive", P1: "warning", P2: "secondary", P3: "outline",
}

function OwnerCell({ name }: { name?: string | null }) {
  if (!name) return <span className="text-muted-foreground text-xs">—</span>
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div className="flex items-center gap-1.5">
      <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials}</AvatarFallback></Avatar>
      <span className="text-sm">{name}</span>
    </div>
  )
}

export function OwnershipTable() {
  const { services, isLoading, fetchServices } = useOrganizationStore()
  const [search, setSearch] = useState("")

  useEffect(() => { fetchServices() }, [fetchServices])

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.team?.name ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-8" placeholder="Search services…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Owning Team</TableHead>
              <TableHead>Primary Owner</TableHead>
              <TableHead>Secondary Owner</TableHead>
              <TableHead>Assignment Group</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && services.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-10">No services found</TableCell></TableRow>
            )}
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell><Badge variant={tierVariant[s.tier]}>{s.tier}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{s.team?.name ?? "—"}</TableCell>
                <TableCell><OwnerCell name={s.ownership?.primaryUser?.name} /></TableCell>
                <TableCell><OwnerCell name={s.ownership?.secondaryUser?.name} /></TableCell>
                <TableCell>
                  {s.ownership?.assignmentGroup?.name
                    ? <Badge variant="secondary">{s.ownership.assignmentGroup.name}</Badge>
                    : <span className="text-muted-foreground text-xs">—</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
