"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { NavItem } from "@/types/navigation"

interface SidebarNavItemProps {
  item: NavItem
  collapsed: boolean
}

export function SidebarNavItem({ item, collapsed }: SidebarNavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
  const hasChildren = !!item.children?.length
  const [open, setOpen] = useState(isActive)

  const Icon = item.icon

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={hasChildren ? (item.children?.[0]?.href ?? item.href) : item.href}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
              isActive
                ? "bg-sidebar-accent text-primary"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-sidebar-accent text-primary"
              : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", open && "rotate-180")}
          />
        </button>

        {open && (
          <div className="ml-6 mt-0.5 flex flex-col gap-0.5 border-l border-sidebar-border pl-3">
            {item.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "rounded-md px-2 py-1.5 text-xs transition-colors",
                  pathname === child.href
                    ? "text-primary font-medium"
                    : "text-sidebar-foreground/50 hover:text-sidebar-foreground"
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-primary"
          : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  )
}
