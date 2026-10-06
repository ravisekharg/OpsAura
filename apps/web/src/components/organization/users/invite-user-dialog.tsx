"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOrganizationStore } from "@/store/organization-store"

const ROLES = [
  { label: "Tenant Admin",        value: "tenant_admin" },
  { label: "Tenant Manager",      value: "tenant_manager" },
  { label: "Operations Manager",  value: "operations_manager" },
  { label: "OnCall Manager",      value: "oncall_manager" },
  { label: "Scheduler",           value: "scheduler" },
  { label: "Engineer",            value: "engineer" },
  { label: "Incident Commander",  value: "incident_commander" },
  { label: "Executive",           value: "executive" },
  { label: "Read Only",           value: "tenant_read_only" },
]

interface InviteUserDialogProps {
  open: boolean
  onClose: () => void
}

export function InviteUserDialog({ open, onClose }: InviteUserDialogProps) {
  const inviteUser = useOrganizationStore((s) => s.inviteUser)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [roleName, setRoleName] = useState("engineer")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await inviteUser({ name, email, roleName })
      setName(""); setEmail(""); setRoleName("engineer")
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Full Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Email</label>
            <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Role</label>
            <Select value={roleName} onValueChange={setRoleName}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Inviting…" : "Send Invite"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
