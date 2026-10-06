"use client"

import { useSystemHealthStore } from "@/store/system-health-store"

interface SparklineProps {
  values: number[]
  color: string
  height?: number
}

function Sparkline({ values, color, height = 40 }: SparklineProps) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const w = 200
  const h = height
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(" ")

  return (
    <svg width={w} height={h} className="w-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function MetricsSparklines() {
  const { services, metrics } = useSystemHealthStore()
  const tracked = services.filter((s) => metrics[s.id])

  if (tracked.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {tracked.map((svc) => {
        const m = metrics[svc.id]
        const latencies = m.map((x) => x.latencyMs)
        const errors = m.map((x) => x.errorRate)
        const latest = m[m.length - 1]

        return (
          <div key={svc.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">{svc.name}</p>
              <p className="text-xs text-muted-foreground">Last 24h</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Latency</p>
                  <p className="text-xs font-medium text-foreground">{latest.latencyMs}ms</p>
                </div>
                <Sparkline values={latencies} color="#6366f1" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Error Rate</p>
                  <p className="text-xs font-medium text-foreground">{latest.errorRate.toFixed(2)}%</p>
                </div>
                <Sparkline values={errors} color="#f43f5e" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
