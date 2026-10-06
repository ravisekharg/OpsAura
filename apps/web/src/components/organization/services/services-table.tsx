"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Box, Loader2 } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useOrganizationStore } from "@/store/organization-store"
import { ServiceDialog } from "./service-dialog"

const tierVariant: Record<string, "destructive" | "warning" | "secondary" | "outline"> = {
  P0: "destructive", P1: "warning", P2: "secondary", P3: "outline",
}

export function ServicesTable() {
  const { services, isLoading, error, fetchServices } = useOrganizationStore()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => { fetchServices() }, [fetchServices])

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.team?.name ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search services…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />New Service
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Owning Team</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && services.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">No services found</TableCell></TableRow>
            )}
            {filtered.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                      <Box className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium leading-none">{service.name}</p>
                      {service.description && <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{service.team?.name ?? "—"}</TableCell>
                <TableCell><Badge variant={tierVariant[service.tier]}>{service.tier}</Badge></TableCell>
                <TableCell>
                  <Badge variant={service.status === "ACTIVE" ? "success" : "secondary"}>
                    {service.status.charAt(0) + service.status.slice(1).toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(service.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ServiceDialog open={dialogOpen} onClose={() => { setDialogOpen(false); fetchServices() }} />
    </div>
  )
}
