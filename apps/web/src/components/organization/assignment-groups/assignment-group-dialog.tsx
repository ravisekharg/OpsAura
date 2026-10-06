"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAssignmentStore } from "@/store/assignment-store"
import { useOrganizationStore } from "@/store/organization-store"

interface Props { open: boolean; onClose: () => void }

export function AssignmentGroupDialog({ open, onClose }: Props) {
  const addGroup = useAssignmentStore((s) => s.addGroup)
  const { teams, fetchTeams } = useOrganizationStore()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [teamId, setTeamId] = useState("")
  const [oncallPolicy, setOncallPolicy] = useState("Weekly Rotation")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { fetchTeams() }, [fetchTeams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await addGroup({
        name,
        description,
        team: teamId ? (teams.find((t) => t.id === teamId) ?? null) : null,
        oncallPolicy,
        active: true,
      })
      setName(""); setDescription(""); setTeamId(""); setOncallPolicy("Weekly Rotation")
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
        <DialogHeader><DialogTitle>Create Assignment Group</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Group Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Platform On-Call" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
          </div>
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
            <label className="text-xs font-medium text-foreground">OnCall Policy</label>
            <Select value={oncallPolicy} onValueChange={setOncallPolicy}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Weekly Rotation", "Daily Rotation", "Follow-the-sun", "Custom"].map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create Group"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
