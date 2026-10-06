"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEscalationStore, type EscalationType, type EscalationPriority } from "@/store/escalation-store"
import { useOrganizationStore } from "@/store/organization-store"

interface Props { open: boolean; onClose: () => void; type: EscalationType }

export function EscalationDialog({ open, onClose, type }: Props) {
  const { addEscalation, policies } = useEscalationStore()
  const services = useOrganizationStore((s) => s.services)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<EscalationPriority>("P1")
  const [service, setService] = useState("")
  const [policyId, setPolicyId] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactCompany, setContactCompany] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const policy = policies.find((p) => p.id === policyId)
    addEscalation({
      title, description, type, priority, service,
      policyId, policyName: policy?.name ?? "",
      status: "open", currentStep: 1, assignedTo: "",
      contactName, contactEmail, contactCompany,
    })
    setTitle(""); setDescription(""); setPriority("P1"); setService(""); setPolicyId("")
    setContactName(""); setContactEmail(""); setContactCompany("")
    onClose()
  }

  const typeLabel = type === "customer" ? "Customer" : "Vendor"

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Raise {typeLabel} Escalation</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Title</label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief description of the issue" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Additional context" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Priority</label>
              <Select value={priority} onValueChange={(v) => setPriority(v as EscalationPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(["P0","P1","P2","P3"] as const).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Affected Service</label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                <SelectContent>{services.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Escalation Policy</label>
            <Select value={policyId} onValueChange={setPolicyId}>
              <SelectTrigger><SelectValue placeholder="Select policy" /></SelectTrigger>
              <SelectContent>{policies.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="border-t border-border pt-3 flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground">{typeLabel} Contact</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Contact Name</label>
                <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Full name" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium">Company</label>
                <Input value={contactCompany} onChange={(e) => setContactCompany(e.target.value)} placeholder="Company name" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Contact Email</label>
              <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="contact@company.com" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Raise Escalation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
