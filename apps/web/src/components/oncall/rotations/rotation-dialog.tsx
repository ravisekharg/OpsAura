"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnCallStore, type RotationType, type WeekDay, type RotationMember } from "@/store/oncall-store"

const DAYS: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

interface Props { open: boolean; onClose: () => void }

export function RotationDialog({ open, onClose }: Props) {
  const { addRotation, schedules } = useOnCallStore()
  const [name, setName] = useState("")
  const [scheduleId, setScheduleId] = useState("")
  const [type, setType] = useState<RotationType>("weekly")
  const [handoffDay, setHandoffDay] = useState<WeekDay>("Mon")
  const [handoffTime, setHandoffTime] = useState("09:00")
  const [members, setMembers] = useState<RotationMember[]>([{ userId: "", name: "", email: "" }])

  function addMember() {
    setMembers((m) => [...m, { userId: "", name: "", email: "" }])
  }

  function removeMember(i: number) {
    setMembers((m) => m.filter((_, idx) => idx !== i))
  }

  function updateMember(i: number, field: keyof RotationMember, value: string) {
    setMembers((m) => m.map((mem, idx) => idx === i ? { ...mem, [field]: value } : mem))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validMembers = members.filter((m) => m.name.trim())
    addRotation({ name, scheduleId, type, members: validMembers, handoffDay, handoffTime, active: true })
    setName(""); setScheduleId(""); setType("weekly"); setHandoffDay("Mon"); setHandoffTime("09:00")
    setMembers([{ userId: "", name: "", email: "" }])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader><DialogTitle>Create Rotation</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Rotation Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Platform Weekly Rotation" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Schedule</label>
              <Select value={scheduleId} onValueChange={setScheduleId}>
                <SelectTrigger><SelectValue placeholder="Select schedule" /></SelectTrigger>
                <SelectContent>{schedules.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Rotation Type</label>
              <Select value={type} onValueChange={(v) => setType(v as RotationType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Handoff Day</label>
              <Select value={handoffDay} onValueChange={(v) => setHandoffDay(v as WeekDay)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DAYS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Handoff Time</label>
              <Input type="time" value={handoffTime} onChange={(e) => setHandoffTime(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Members (rotation order)</label>
              <button type="button" onClick={addMember} className="flex items-center gap-1 text-xs text-primary hover:underline">
                <Plus className="h-3 w-3" />Add Member
              </button>
            </div>
            {members.map((m, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input className="h-8 text-xs" value={m.name} onChange={(e) => updateMember(i, "name", e.target.value)} placeholder="Full name" />
                <Input className="h-8 text-xs" type="email" value={m.email} onChange={(e) => updateMember(i, "email", e.target.value)} placeholder="email@company.com" />
                {members.length > 1 && (
                  <button type="button" onClick={() => removeMember(i)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Rotation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
