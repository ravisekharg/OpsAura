"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useWarRoomStore, type Participant, type ParticipantRole } from "@/store/war-room-store"

const roleVariant: Record<ParticipantRole, "destructive" | "warning" | "secondary" | "outline"> = {
  incident_commander: "destructive", engineer: "warning", observer: "secondary", executive: "outline",
}

interface Props { roomId: string; participants: Participant[]; readonly?: boolean }

export function WarRoomParticipants({ roomId, participants, readonly }: Props) {
  const addParticipant = useWarRoomStore((s) => s.addParticipant)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<ParticipantRole>("engineer")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addParticipant(roomId, { userId: crypto.randomUUID(), name, email, role })
    setName(""); setEmail(""); setRole("engineer")
    setDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Participants ({participants.length})</h3>
        {!readonly && (
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setDialogOpen(true)}>
            <UserPlus className="h-3.5 w-3.5 mr-1" />Invite
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {participants.map((p) => (
          <div key={p.userId} className="flex items-center gap-2.5">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">{p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground leading-none">{p.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{p.email}</p>
            </div>
            <Badge variant={roleVariant[p.role]} className="text-[10px] capitalize">
              {p.role.replace("_", " ")}
            </Badge>
          </div>
        ))}
        {participants.length === 0 && <p className="text-xs text-muted-foreground">No participants yet</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && setDialogOpen(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite Participant</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Name</label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Email</label>
              <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@company.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Role</label>
              <Select value={role} onValueChange={(v) => setRole(v as ParticipantRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="incident_commander">Incident Commander</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="observer">Observer</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Invite</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
