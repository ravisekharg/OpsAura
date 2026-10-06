"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEscalationStore, type EscalationStep, type EscalationStepType, type EscalationCondition } from "@/store/escalation-store"
import { useOrganizationStore } from "@/store/organization-store"

const STEP_TYPES: EscalationStepType[] = ["oncall", "user", "team", "assignment_group"]
const CONDITIONS: EscalationCondition[] = ["no_ack", "no_resolve", "always"]
const CHANNELS = ["voice", "slack", "teams", "email"]

interface Props { open: boolean; onClose: () => void }

const defaultStep = (): EscalationStep => ({ order: 1, type: "oncall", target: "", delayMinutes: 5, condition: "no_ack", notifyChannels: ["voice"] })

export function PolicyDialog({ open, onClose }: Props) {
  const addPolicy = useEscalationStore((s) => s.addPolicy)
  const teams = useOrganizationStore((s) => s.teams)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [team, setTeam] = useState("")
  const [repeatCount, setRepeatCount] = useState("2")
  const [steps, setSteps] = useState<EscalationStep[]>([defaultStep()])

  function addStep() {
    setSteps((s) => [...s, { ...defaultStep(), order: s.length + 1 }])
  }

  function removeStep(i: number) {
    setSteps((s) => s.filter((_, idx) => idx !== i).map((st, idx) => ({ ...st, order: idx + 1 })))
  }

  function updateStep(i: number, patch: Partial<EscalationStep>) {
    setSteps((s) => s.map((st, idx) => idx === i ? { ...st, ...patch } : st))
  }

  function toggleChannel(stepIdx: number, ch: string) {
    setSteps((s) => s.map((st, idx) => {
      if (idx !== stepIdx) return st
      const has = st.notifyChannels.includes(ch)
      return { ...st, notifyChannels: has ? st.notifyChannels.filter((c) => c !== ch) : [...st.notifyChannels, ch] }
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addPolicy({ name, description, team, steps, repeatCount: Number(repeatCount), active: true })
    setName(""); setDescription(""); setTeam(""); setRepeatCount("2"); setSteps([defaultStep()])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Create Escalation Policy</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Policy Name</label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Platform Escalation" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Team</label>
              <Select value={team} onValueChange={setTeam}>
                <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                <SelectContent>{teams.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Description</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Repeat</label>
              <Input type="number" min="0" max="10" className="w-20" value={repeatCount} onChange={(e) => setRepeatCount(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Escalation Steps</label>
              <button type="button" onClick={addStep} className="flex items-center gap-1 text-xs text-primary hover:underline">
                <Plus className="h-3 w-3" />Add Step
              </button>
            </div>
            {steps.map((step, i) => (
              <div key={i} className="rounded-md border border-border p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Step {step.order}</span>
                  {steps.length > 1 && (
                    <button type="button" onClick={() => removeStep(i)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-muted-foreground">Notify Type</label>
                    <Select value={step.type} onValueChange={(v) => updateStep(i, { type: v as EscalationStepType })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{STEP_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-muted-foreground">Target</label>
                    <Input className="h-8 text-xs" value={step.target} onChange={(e) => updateStep(i, { target: e.target.value })} placeholder="Name" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-muted-foreground">Delay (min)</label>
                    <Input className="h-8 text-xs" type="number" min="0" value={step.delayMinutes} onChange={(e) => updateStep(i, { delayMinutes: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-muted-foreground">Condition</label>
                    <Select value={step.condition} onValueChange={(v) => updateStep(i, { condition: v as EscalationCondition })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-muted-foreground">Notify Channels</label>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {CHANNELS.map((ch) => (
                        <button key={ch} type="button" onClick={() => toggleChannel(i, ch)}
                          className={`rounded px-2 py-0.5 text-[10px] border transition-colors ${step.notifyChannels.includes(ch) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary"}`}>
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Policy</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
