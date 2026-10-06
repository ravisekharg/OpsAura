"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAssignmentStore, type RuleCondition, type RuleConditionField, type RuleConditionOperator } from "@/store/assignment-store"

const FIELDS: RuleConditionField[] = ["service", "severity", "source", "tag", "region"]
const OPERATORS: RuleConditionOperator[] = ["equals", "contains", "starts_with", "in"]

interface Props { open: boolean; onClose: () => void }

export function RoutingRuleDialog({ open, onClose }: Props) {
  const { addRule, groups, rules, fetchGroups } = useAssignmentStore()
  const [name, setName] = useState("")
  const [assignmentGroupId, setAssignmentGroupId] = useState("")
  const [conditions, setConditions] = useState<RuleCondition[]>([{ field: "service", operator: "equals", value: "" }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { fetchGroups() }, [fetchGroups])

  function addCondition() {
    setConditions((c) => [...c, { field: "service", operator: "equals", value: "" }])
  }
  function removeCondition(i: number) {
    setConditions((c) => c.filter((_, idx) => idx !== i))
  }
  function updateCondition(i: number, patch: Partial<RuleCondition>) {
    setConditions((c) => c.map((cond, idx) => idx === i ? { ...cond, ...patch } : cond))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const group = groups.find((g) => g.id === assignmentGroupId)
    if (!group) return
    setLoading(true)
    setError(null)
    try {
      await addRule({
        name,
        priority: rules.length + 1,
        conditions,
        assignmentGroup: { id: group.id, name: group.name },
        active: true,
      })
      setName(""); setAssignmentGroupId(""); setConditions([{ field: "service", operator: "equals", value: "" }])
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader><DialogTitle>Create Routing Rule</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Rule Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Critical Payment Alerts" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Conditions (ALL must match)</label>
              <button type="button" onClick={addCondition} className="flex items-center gap-1 text-xs text-primary hover:underline">
                <Plus className="h-3 w-3" />Add
              </button>
            </div>
            {conditions.map((cond, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                <Select value={cond.field} onValueChange={(v) => updateCondition(i, { field: v as RuleConditionField })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{FIELDS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={cond.operator} onValueChange={(v) => updateCondition(i, { operator: v as RuleConditionOperator })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{OPERATORS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
                <Input className="h-8 text-xs" value={cond.value} onChange={(e) => updateCondition(i, { value: e.target.value })} placeholder="value" />
                {conditions.length > 1 && (
                  <button type="button" onClick={() => removeCondition(i)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Assign To Group</label>
            <Select value={assignmentGroupId} onValueChange={setAssignmentGroupId}>
              <SelectTrigger><SelectValue placeholder="Select assignment group" /></SelectTrigger>
              <SelectContent>
                {groups.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create Rule"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
