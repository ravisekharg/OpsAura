"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAlertStore } from "@/store/alert-store"

interface Props { open: boolean; onClose: () => void }

export function CorrelationRuleDialog({ open, onClose }: Props) {
  const addCorrelationRule = useAlertStore((s) => s.addCorrelationRule)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [matchField, setMatchField] = useState("service")
  const [matchValue, setMatchValue] = useState("")
  const [groupBy, setGroupBy] = useState("service")
  const [windowMinutes, setWindowMinutes] = useState("5")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addCorrelationRule({ name, description, matchField, matchValue, groupBy, windowMinutes: Number(windowMinutes), active: true })
    setName(""); setDescription(""); setMatchField("service"); setMatchValue(""); setGroupBy("service"); setWindowMinutes("5")
    onClose()
  }

  const fields = ["service", "severity", "source", "tag", "region"]

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>New Correlation Rule</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Rule Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Group Payments Alerts" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Match Field</label>
              <Select value={matchField} onValueChange={setMatchField}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{fields.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Match Value</label>
              <Input required value={matchValue} onChange={(e) => setMatchValue(e.target.value)} placeholder="e.g. Payments API" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Group By</label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{fields.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Window (minutes)</label>
              <Input type="number" min="1" max="60" value={windowMinutes} onChange={(e) => setWindowMinutes(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Rule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
