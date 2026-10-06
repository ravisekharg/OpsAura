"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useServiceNowStore } from "@/store/servicenow-store"

interface Props { open: boolean; onClose: () => void }

export function ConnectionDialog({ open, onClose }: Props) {
  const addConnection = useServiceNowStore((s) => s.addConnection)
  const [name, setName] = useState("")
  const [instanceUrl, setInstanceUrl] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addConnection({ name, instanceUrl, username, password, clientId, clientSecret })
    setName(""); setInstanceUrl(""); setUsername(""); setPassword(""); setClientId(""); setClientSecret("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add ServiceNow Connection</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Connection Name</label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="CSX Production" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Instance URL</label>
              <Input required value={instanceUrl} onChange={(e) => setInstanceUrl(e.target.value)} placeholder="https://xxx.service-now.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Username</label>
              <Input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="service account" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Password</label>
              <Input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">OAuth Client ID</label>
              <Input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Optional" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">OAuth Client Secret</label>
              <Input type="password" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Connection</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
