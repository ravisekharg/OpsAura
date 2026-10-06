import type { Metadata } from "next"
import { WarRoomsList } from "@/components/war-rooms/war-rooms-list"

export const metadata: Metadata = { title: "Active War Rooms — OpsAura" }

export default function ActiveWarRoomsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Active War Rooms</h1>
        <p className="text-sm text-muted-foreground mt-1">Live incidents with open timelines and action items.</p>
      </div>
      <WarRoomsList filter="active" />
    </div>
  )
}
