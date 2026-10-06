import { PanelLeftClose, PanelLeftOpen, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarNav } from "./sidebar-nav"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-200 shrink-0",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-sidebar-border shrink-0",
          collapsed ? "justify-center px-0" : "gap-2.5 px-4"
        )}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary shrink-0">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
            OpsAura
          </span>
        )}
      </div>

      <ScrollArea className="flex-1">
        <SidebarNav collapsed={collapsed} />
      </ScrollArea>

      <div className="border-t border-sidebar-border p-2 shrink-0">
        <button
          onClick={onToggle}
          className="flex h-8 w-full items-center justify-center gap-2 rounded-md text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors text-xs"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
