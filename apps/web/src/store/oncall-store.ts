import { create } from "zustand"

export type RotationType = "weekly" | "daily" | "custom"
export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"

export interface Schedule {
  id: string
  name: string
  team: string
  timezone: string
  description: string
  active: boolean
  createdAt: Date
}

export interface RotationMember {
  userId: string
  name: string
  email: string
}

export interface Rotation {
  id: string
  scheduleId: string
  name: string
  type: RotationType
  members: RotationMember[]
  handoffDay: WeekDay
  handoffTime: string
  active: boolean
  createdAt: Date
}

export interface Override {
  id: string
  scheduleId: string
  scheduleName: string
  originalUser: string
  overrideUser: string
  startAt: Date
  endAt: Date
  reason: string
  createdAt: Date
}

export interface CoverageSlot {
  day: WeekDay
  date: Date
  oncallUser: string
  scheduleId: string
  scheduleName: string
  isOverride: boolean
}

interface OnCallState {
  schedules: Schedule[]
  rotations: Rotation[]
  overrides: Override[]
  addSchedule: (s: Omit<Schedule, "id" | "createdAt">) => void
  addRotation: (r: Omit<Rotation, "id" | "createdAt">) => void
  addOverride: (o: Omit<Override, "id" | "createdAt">) => void
  toggleSchedule: (id: string) => void
  toggleRotation: (id: string) => void
  removeOverride: (id: string) => void
  getCoverage: (weekStart: Date) => CoverageSlot[]
}

const MOCK_SCHEDULES: Schedule[] = [
  { id: "sc1", name: "Platform On-Call Schedule", team: "Platform Engineering", timezone: "Asia/Kolkata", description: "Primary on-call for platform services", active: true, createdAt: new Date("2025-01-15") },
  { id: "sc2", name: "Payments On-Call Schedule", team: "Backend Services", timezone: "Asia/Kolkata", description: "Primary on-call for payments services", active: true, createdAt: new Date("2025-01-20") },
  { id: "sc3", name: "Data On-Call Schedule", team: "Data Engineering", timezone: "US/Eastern", description: "On-call for data pipelines", active: false, createdAt: new Date("2025-02-10") },
]

const MOCK_ROTATIONS: Rotation[] = [
  {
    id: "ro1", scheduleId: "sc1", name: "Platform Weekly Rotation", type: "weekly",
    members: [
      { userId: "u1", name: "Ravi Reddy", email: "ravi.reddy@opsaura.io" },
      { userId: "u2", name: "Priya Nair", email: "priya.nair@opsaura.io" },
    ],
    handoffDay: "Mon", handoffTime: "09:00", active: true, createdAt: new Date("2025-01-16"),
  },
  {
    id: "ro2", scheduleId: "sc2", name: "Payments Weekly Rotation", type: "weekly",
    members: [
      { userId: "u2", name: "Priya Nair", email: "priya.nair@opsaura.io" },
      { userId: "u3", name: "Arjun Sharma", email: "arjun.sharma@opsaura.io" },
    ],
    handoffDay: "Mon", handoffTime: "09:00", active: true, createdAt: new Date("2025-01-21"),
  },
]

const now = new Date()
const daysFrom = (d: number) => new Date(now.getTime() + d * 86400000)

const MOCK_OVERRIDES: Override[] = [
  {
    id: "ov1", scheduleId: "sc1", scheduleName: "Platform On-Call Schedule",
    originalUser: "Ravi Reddy", overrideUser: "Priya Nair",
    startAt: daysFrom(1), endAt: daysFrom(3),
    reason: "Annual leave", createdAt: new Date(),
  },
  {
    id: "ov2", scheduleId: "sc2", scheduleName: "Payments On-Call Schedule",
    originalUser: "Arjun Sharma", overrideUser: "Priya Nair",
    startAt: daysFrom(5), endAt: daysFrom(6),
    reason: "Conference attendance", createdAt: new Date(),
  },
]

const DAYS: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export const useOnCallStore = create<OnCallState>((set, get) => ({
  schedules: MOCK_SCHEDULES,
  rotations: MOCK_ROTATIONS,
  overrides: MOCK_OVERRIDES,

  addSchedule: (s) => set((st) => ({ schedules: [...st.schedules, { ...s, id: crypto.randomUUID(), createdAt: new Date() }] })),
  addRotation: (r) => set((st) => ({ rotations: [...st.rotations, { ...r, id: crypto.randomUUID(), createdAt: new Date() }] })),
  addOverride: (o) => set((st) => ({ overrides: [...st.overrides, { ...o, id: crypto.randomUUID(), createdAt: new Date() }] })),
  toggleSchedule: (id) => set((st) => ({ schedules: st.schedules.map((s) => s.id === id ? { ...s, active: !s.active } : s) })),
  toggleRotation: (id) => set((st) => ({ rotations: st.rotations.map((r) => r.id === id ? { ...r, active: !r.active } : r) })),
  removeOverride: (id) => set((st) => ({ overrides: st.overrides.filter((o) => o.id !== id) })),

  getCoverage: (weekStart) => {
    const { schedules, rotations, overrides } = get()
    const slots: CoverageSlot[] = []

    DAYS.forEach((day, i) => {
      const date = new Date(weekStart.getTime() + i * 86400000)
      const activeSchedules = schedules.filter((s) => s.active)

      activeSchedules.forEach((schedule) => {
        const rotation = rotations.find((r) => r.scheduleId === schedule.id && r.active)
        if (!rotation || rotation.members.length === 0) return

        const weekIndex = Math.floor((date.getTime() - new Date("2025-01-06").getTime()) / (7 * 86400000))
        const memberIndex = Math.abs(weekIndex) % rotation.members.length
        let oncallUser = rotation.members[memberIndex]?.name ?? "Unassigned"

        const override = overrides.find(
          (o) => o.scheduleId === schedule.id && date >= o.startAt && date < o.endAt
        )
        const isOverride = !!override
        if (override) oncallUser = override.overrideUser

        slots.push({ day, date, oncallUser, scheduleId: schedule.id, scheduleName: schedule.name, isOverride })
      })
    })

    return slots
  },
}))
