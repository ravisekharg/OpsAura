import { cn } from "@/lib/utils"
import { SidebarNavItem } from "./sidebar-nav-item"
import { navigation } from "@/config/navigation"

interface SidebarNavProps {
  collapsed: boolean
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-4 px-3 py-2">
      {navigation.map((section, sectionIndex) => (
        <div key={sectionIndex} className="flex flex-col gap-0.5">
          {section.label && !collapsed && (
            <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
              {section.label}
            </p>
          )}
          {section.items.map((item) => (
            <SidebarNavItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </div>
      ))}
    </nav>
  )
}
