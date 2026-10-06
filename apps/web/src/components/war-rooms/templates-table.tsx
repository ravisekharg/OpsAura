"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useWarRoomStore } from "@/store/war-room-store"

export function TemplatesTable() {
  const { templates, addTemplate } = useWarRoomStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [actionsText, setActionsText] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const defaultActions = actionsText.split("\n").map((a) => a.trim()).filter(Boolean)
    addTemplate({ name, description, defaultParticipantRoles: ["incident_commander", "engineer"], defaultActions })
    setName(""); setDescription(""); setActionsText("")
    setDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div key={t.id} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
            <div>
              <p className="font-semibold text-sm text-foreground">{t.name}</p>
              {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
            </div>
            <div className="flex flex-wrap gap-1">
              {t.defaultParticipantRoles.map((r) => (
                <Badge key={r} variant="secondary" className="text-xs capitalize">{r.replace("_", " ")}</Badge>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Default Actions</p>
              {t.defaultActions.slice(0, 3).map((a, i) => (
                <p key={i} className="text-xs text-foreground flex gap-1.5">
                  <span className="text-muted-foreground">{i + 1}.</span>{a}
                </p>
              ))}
              {t.defaultActions.length > 3 && (
                <p className="text-xs text-muted-foreground">+{t.defaultActions.length - 3} more</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && setDialogOpen(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Template</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Template Name</label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="P0 Incident" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Description</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="When to use this template" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Default Action Items (one per line)</label>
              <textarea
                value={actionsText}
                onChange={(e) => setActionsText(e.target.value)}
                placeholder={"Identify root cause\nNotify stakeholders\nApply fix\nVerify resolution"}
                rows={5}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Create Template</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
