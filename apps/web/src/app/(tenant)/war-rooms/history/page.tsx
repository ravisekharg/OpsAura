import type { Metadata } from "next"
import { WarRoomsList } from "@/components/war-rooms/war-rooms-list"

export const metadata: Metadata = { title: "War Room History — OpsAura" }

export default function WarRoomHistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">War Room History</h1>
        <p className="text-sm text-muted-foreground mt-1">Resolved incidents and their timelines.</p>
      </div>
      <WarRoomsList filter="resolved" />
    </div>
  )
}
