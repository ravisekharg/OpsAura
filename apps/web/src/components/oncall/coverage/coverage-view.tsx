"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOnCallStore } from "@/store/oncall-store"
import { cn } from "@/lib/utils"

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function fmtWeek(start: Date): string {
  const end = new Date(start.getTime() + 6 * 86400000)
  return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function CoverageView() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()))
  const { schedules, getCoverage } = useOnCallStore()
  const coverage = getCoverage(weekStart)
  const activeSchedules = schedules.filter((s) => s.active)
  const today = new Date(); today.setHours(0, 0, 0, 0)

  function prevWeek() { setWeekStart((w) => new Date(w.getTime() - 7 * 86400000)) }
  function nextWeek() { setWeekStart((w) => new Date(w.getTime() + 7 * 86400000)) }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevWeek}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm font-medium text-foreground w-52 text-center">{fmtWeek(weekStart)}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextWeek}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <Button variant="ghost" size="sm" className="text-xs" onClick={() => setWeekStart(getWeekStart(new Date()))}>
          This Week
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[180px_repeat(7,1fr)] border-b border-border">
          <div className="px-4 py-2.5 text-xs font-medium text-muted-foreground bg-muted/30">Schedule</div>
          {DAYS.map((day, i) => {
            const date = new Date(weekStart.getTime() + i * 86400000)
            const isToday = date.getTime() === today.getTime()
            return (
              <div key={day} className={cn("px-2 py-2.5 text-center border-l border-border", isToday && "bg-primary/5")}>
                <p className={cn("text-xs font-medium", isToday ? "text-primary" : "text-muted-foreground")}>{day}</p>
                <p className={cn("text-xs mt-0.5", isToday ? "text-primary font-semibold" : "text-muted-foreground/60")}>
                  {date.getDate()}
                </p>
              </div>
            )
          })}
        </div>

        {activeSchedules.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No active schedules</div>
        )}

        {activeSchedules.map((schedule, si) => (
          <div key={schedule.id} className={cn("grid grid-cols-[180px_repeat(7,1fr)]", si < activeSchedules.length - 1 && "border-b border-border")}>
            <div className="px-4 py-3 bg-muted/20">
              <p className="text-xs font-medium text-foreground leading-snug">{schedule.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{schedule.team}</p>
            </div>
            {DAYS.map((day, i) => {
              const date = new Date(weekStart.getTime() + i * 86400000)
              const isToday = date.getTime() === today.getTime()
              const slot = coverage.find((c) => c.scheduleId === schedule.id && c.day === day)
              return (
                <div key={day} className={cn("px-2 py-3 border-l border-border text-center", isToday && "bg-primary/5")}>
                  {slot ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-medium text-foreground leading-none">{slot.oncallUser.split(" ")[0]}</span>
                      {slot.isOverride && <Badge variant="warning" className="text-[9px] px-1 py-0">Override</Badge>}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/40">—</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
