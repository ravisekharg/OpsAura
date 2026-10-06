"use client"

import { useEffect, useState } from "react"

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
}

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!now) return null

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
      <span>{formatDate(now)}</span>
      <span className="text-border">|</span>
      <span className="font-medium text-foreground">{formatTime(now)}</span>
    </div>
  )
}
