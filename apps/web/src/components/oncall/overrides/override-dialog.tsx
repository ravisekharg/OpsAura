"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnCallStore } from "@/store/oncall-store"

interface Props { open: boolean; onClose: () => void }

export function OverrideDialog({ open, onClose }: Props) {
  const { addOverride, schedules, rotations } = useOnCallStore()
  const [scheduleId, setScheduleId] = useState("")
  const [originalUser, setOriginalUser] = useState("")
  const [overrideUser, setOverrideUser] = useState("")
  const [startAt, setStartAt] = useState("")
  const [endAt, setEndAt] = useState("")
  const [reason, setReason] = useState("")

  const scheduleMembers = rotations
    .filter((r) => r.scheduleId === scheduleId)
    .flatMap((r) => r.members)
    .filter((m, i, arr) => arr.findIndex((x) => x.userId === m.userId) === i)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const schedule = schedules.find((s) => s.id === scheduleId)
    addOverride({
      scheduleId, scheduleName: schedule?.name ?? "",
      originalUser, overrideUser,
      startAt: new Date(startAt), endAt: new Date(endAt), reason,
    })
    setScheduleId(""); setOriginalUser(""); setOverrideUser(""); setStartAt(""); setEndAt(""); setReason("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Override</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Schedule</label>
            <Select value={scheduleId} onValueChange={(v) => { setScheduleId(v); setOriginalUser("") }}>
              <SelectTrigger><SelectValue placeholder="Select schedule" /></SelectTrigger>
              <SelectContent>{schedules.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Original On-Call</label>
              {scheduleMembers.length > 0 ? (
                <Select value={originalUser} onValueChange={setOriginalUser}>
                  <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                  <SelectContent>{scheduleMembers.map((m) => <SelectItem key={m.userId} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                </Select>
              ) : (
                <Input value={originalUser} onChange={(e) => setOriginalUser(e.target.value)} placeholder="Name" />
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Override With</label>
              {scheduleMembers.length > 0 ? (
                <Select value={overrideUser} onValueChange={setOverrideUser}>
                  <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                  <SelectContent>{scheduleMembers.map((m) => <SelectItem key={m.userId} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                </Select>
              ) : (
                <Input value={overrideUser} onChange={(e) => setOverrideUser(e.target.value)} placeholder="Name" />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Start</label>
              <Input required type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">End</label>
              <Input required type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Reason</label>
            <Input required value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Annual leave, conference, etc." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Override</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
