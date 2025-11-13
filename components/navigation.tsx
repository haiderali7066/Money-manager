"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, TrendingUp, List } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Transactions", href: "/transactions", icon: List },
    { label: "Analytics", href: "/analytics", icon: TrendingUp },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border sm:hidden z-40">
      <div className="flex items-center justify-around">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 gap-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
