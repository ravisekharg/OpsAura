import type { LucideIcon } from "lucide-react"

export interface NavChild {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  children?: NavChild[]
}

export interface NavSection {
  label?: string
  items: NavItem[]
}
