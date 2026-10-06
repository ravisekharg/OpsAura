"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOrganizationStore } from "@/store/organization-store"

interface ServiceDialogProps {
  open: boolean
  onClose: () => void
}

export function ServiceDialog({ open, onClose }: ServiceDialogProps) {
  const { addService, teams, fetchTeams } = useOrganizationStore()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [teamId, setTeamId] = useState("")
  const [tier, setTier] = useState("P1")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { fetchTeams() }, [fetchTeams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await addService({ name, description, teamId: teamId || undefined, tier })
      setName(""); setDescription(""); setTeamId(""); setTier("P1")
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Service</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Service Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Payments API" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Owning Team</label>
              <Select value={teamId} onValueChange={setTeamId}>
                <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                <SelectContent>
                  {teams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Tier</label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["P0", "P1", "P2", "P3"] as const).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create Service"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
