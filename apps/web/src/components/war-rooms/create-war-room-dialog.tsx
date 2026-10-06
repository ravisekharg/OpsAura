"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWarRoomStore } from "@/store/war-room-store"
import { useOrganizationStore } from "@/store/organization-store"
import { useAuthStore } from "@/store/auth-store"

interface Props { open: boolean; onClose: () => void }

export function CreateWarRoomDialog({ open, onClose }: Props) {
  const router = useRouter()
  const { createRoom, templates } = useWarRoomStore()
  const services = useOrganizationStore((s) => s.services)
  const user = useAuthStore((s) => s.user)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState<"critical" | "high" | "medium">("high")
  const [service, setService] = useState("")
  const [templateId, setTemplateId] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = createRoom({ title, description, severity, service, alertIds: [], incidentCommander: user?.name ?? "Unknown", status: "active", templateId: templateId || undefined })
    setTitle(""); setDescription(""); setSeverity("high"); setService(""); setTemplateId("")
    onClose()
    router.push(`/war-rooms/active/${id}`)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Open War Room</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Title</label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief incident title" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is happening?" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Severity</label>
              <Select value={severity} onValueChange={(v) => setSeverity(v as typeof severity)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
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
            <label className="text-xs font-medium">Template (optional)</label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger><SelectValue placeholder="No template" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">No template</SelectItem>
                {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Open War Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
