"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnCallStore } from "@/store/oncall-store"
import { useOrganizationStore } from "@/store/organization-store"

const TIMEZONES = ["Asia/Kolkata", "US/Eastern", "US/Pacific", "Europe/London", "UTC"]

interface Props { open: boolean; onClose: () => void }

export function ScheduleDialog({ open, onClose }: Props) {
  const addSchedule = useOnCallStore((s) => s.addSchedule)
  const teams = useOrganizationStore((s) => s.teams)
  const [name, setName] = useState("")
  const [team, setTeam] = useState("")
  const [timezone, setTimezone] = useState("Asia/Kolkata")
  const [description, setDescription] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addSchedule({ name, team, timezone, description, active: true })
    setName(""); setTeam(""); setTimezone("Asia/Kolkata"); setDescription("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Schedule</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Schedule Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Platform On-Call Schedule" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Team</label>
            <Select value={team} onValueChange={setTeam}>
              <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
              <SelectContent>{teams.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Timezone</label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
