"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAlertStore } from "@/store/alert-store"

interface Props { open: boolean; onClose: () => void }

export function SuppressionRuleDialog({ open, onClose }: Props) {
  const addSuppressionRule = useAlertStore((s) => s.addSuppressionRule)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [matchField, setMatchField] = useState("service")
  const [matchValue, setMatchValue] = useState("")
  const [reason, setReason] = useState("")
  const [expiresAt, setExpiresAt] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addSuppressionRule({
      name, description, matchField, matchValue, reason,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      active: true,
    })
    setName(""); setDescription(""); setMatchField("service"); setMatchValue(""); setReason(""); setExpiresAt("")
    onClose()
  }

  const fields = ["service", "severity", "source", "tag", "region"]

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>New Suppression Rule</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Rule Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Suppress maintenance alerts" />
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
              <Input required value={matchValue} onChange={(e) => setMatchValue(e.target.value)} placeholder="e.g. Analytics Pipeline" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Reason</label>
            <Input required value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Scheduled maintenance" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Expires At (optional)</label>
            <Input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
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
