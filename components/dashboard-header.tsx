"use client";

import { useState, useEffect } from "react";
import {
  LogOut,
  Moon,
  Sun,
  Menu,
  LayoutDashboard,
  List,
  TrendingUp,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/token-storage";
import Link from "next/link";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName = "User" }: DashboardHeaderProps) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: string) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Transactions", href: "/transactions", icon: List },
    { label: "Analytics", href: "/analytics", icon: TrendingUp },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur supports-[backdrop-filter]:bg-card/95">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Left */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
            <span className="text-xl font-bold text-primary">₨</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground hidden sm:block">
              Money Manager
            </h1>
            <h1 className="text-lg font-bold text-foreground sm:hidden">
              Manager
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Show user name on mobile */}
          <span className="text-sm text-muted-foreground sm:hidden">
            {userName.split("@")[0]}
          </span>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Menu button for mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground sm:hidden"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logout button for desktop */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground hidden sm:inline"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="flex flex-col bg-card border-t border-border divide-y divide-border sm:hidden">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 text-foreground hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-destructive font-medium hover:text-destructive/80"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
