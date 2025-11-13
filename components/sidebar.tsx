"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, TrendingUp, List, Settings } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Transactions", href: "/transactions", icon: List },
    { label: "Analytics", href: "/analytics", icon: TrendingUp },
    { label: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <aside className="hidden sm:flex flex-col w-64 bg-card border-r border-border fixed left-0 top-0 h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
          <span className="text-lg font-bold text-primary">₨</span>
        </div>
        <span className="text-lg font-bold text-foreground">Money Manager</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border text-xs text-muted-foreground">
        <p>Money Manager v1.0</p>
      </div>
    </aside>
  )
}
