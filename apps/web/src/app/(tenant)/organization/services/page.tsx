import type { Metadata } from "next"
import { ServicesTable } from "@/components/organization/services/services-table"

export const metadata: Metadata = { title: "Services — OpsAura" }

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Services</h1>
        <p className="text-sm text-muted-foreground mt-1">Define and manage services owned by your teams.</p>
      </div>
      <ServicesTable />
    </div>
  )
}
