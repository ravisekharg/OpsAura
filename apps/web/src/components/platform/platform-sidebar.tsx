"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Building2, Plus, CreditCard, Receipt,
  Users, Flag, Globe, ShieldCheck, Activity, Settings,
  ChevronDown, ChevronRight, Zap, PanelLeftClose, PanelLeftOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavChild {
  label: string
  href: string
}

interface NavSection {
  key: string
  label: string
  icon: React.ElementType
  children: NavChild[]
}

const SECTIONS: NavSection[] = [
  {
    key: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    children: [
      { label: "Dashboard", href: "/platform/dashboard" },
    ],
  },
  {
    key: "tenants",
    label: "Tenant Management",
    icon: Building2,
    children: [
      { label: "All Tenants", href: "/platform/tenants" },
      { label: "Provision New", href: "/platform/tenants/new" },
    ],
  },
  {
    key: "billing",
    label: "Subscription & Billing",
    icon: CreditCard,
    children: [
      { label: "Billing Overview", href: "/platform/billing" },
      { label: "Subscriptions", href: "/platform/subscriptions" },
      { label: "Plans", href: "/platform/plans" },
    ],
  },
  {
    key: "config",
    label: "Platform Config",
    icon: Settings,
    children: [
      { label: "Feature Flags", href: "/platform/feature-flags" },
      { label: "Domains", href: "/platform/domains" },
    ],
  },
  {
    key: "admin",
    label: "Administration",
    icon: ShieldCheck,
    children: [
      { label: "Platform Users", href: "/platform/users" },
      { label: "Audit Log", href: "/platform/audit" },
      { label: "System Health", href: "/platform/system-health" },
    ],
  },
]

function isActiveSection(section: NavSection, pathname: string): boolean {
  return section.children.some((c) => pathname.startsWith(c.href))
}

export function PlatformSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // All sections open by default
    return Object.fromEntries(SECTIONS.map((s) => [s.key, true]))
  })

  // Auto-open the section containing the active route
  useEffect(() => {
    SECTIONS.forEach((section) => {
      if (isActiveSection(section, pathname)) {
        setOpenSections((prev) => ({ ...prev, [section.key]: true }))
      }
    })
  }, [pathname])

  function toggleSection(key: string) {
    if (collapsed) return
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-200 shrink-0",
        collapsed ? "w-[56px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex h-14 items-center border-b border-sidebar-border shrink-0",
        collapsed ? "justify-center" : "gap-2.5 px-4"
      )}>
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary shrink-0">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-xs font-bold text-sidebar-foreground leading-none">OpsAura</p>
            <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Platform Admin</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {SECTIONS.map((section) => {
          const SectionIcon = section.icon
          const isOpen = openSections[section.key]
          const hasActive = isActiveSection(section, pathname)

          return (
            <div key={section.key} className="mb-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.key)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
                  hasActive
                    ? "text-primary"
                    : "text-sidebar-foreground/40 hover:text-sidebar-foreground/70",
                  collapsed && "justify-center"
                )}
                title={collapsed ? section.label : undefined}
              >
                <SectionIcon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{section.label}</span>
                    {isOpen
                      ? <ChevronDown className="h-3 w-3" />
                      : <ChevronRight className="h-3 w-3" />}
                  </>
                )}
              </button>

              {/* Section Children */}
              {!collapsed && isOpen && (
                <div className="ml-4 border-l border-sidebar-border pl-3 pb-1 flex flex-col gap-0.5">
                  {section.children.map((child) => {
                    const active = pathname === child.href || pathname.startsWith(child.href + "/")
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "rounded-md px-2 py-1.5 text-xs transition-colors",
                          active
                            ? "bg-sidebar-accent text-primary font-medium"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}

              {/* Collapsed: show only icons for each child as dots */}
              {collapsed && (
                <div className="flex flex-col items-center gap-0.5 px-1 pb-1">
                  {section.children.map((child) => {
                    const active = pathname === child.href || pathname.startsWith(child.href + "/")
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        title={child.label}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-colors",
                          active ? "bg-primary" : "bg-sidebar-foreground/20 hover:bg-sidebar-foreground/50"
                        )}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-2 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-full items-center justify-center gap-2 rounded-md text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors text-xs"
        >
          {collapsed
            ? <PanelLeftOpen className="h-4 w-4" />
            : <><PanelLeftClose className="h-4 w-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  )
}
