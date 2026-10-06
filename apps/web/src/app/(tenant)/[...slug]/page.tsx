import { Construction } from "lucide-react"

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
      <Construction className="h-10 w-10 text-muted-foreground/40" />
      <h2 className="text-lg font-semibold text-foreground">Coming Soon</h2>
      <p className="text-sm text-muted-foreground">This module is not built yet.</p>
    </div>
  )
}
