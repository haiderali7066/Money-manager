"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"
import { Navigation } from "@/components/navigation"
import { LogOut } from "lucide-react"
import { getUser, getToken, logout } from "@/lib/token-storage"

export default function SettingsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [userName, setUserName] = useState("User")

  useEffect(() => {
    const user = getUser()
    const token = getToken()

    if (!user || !token) {
      router.push("/login")
      return
    }

    setMounted(true)
    setUserName(user.email)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <DashboardHeader userName={userName} />

      <main className="sm:ml-64 px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-24 sm:pb-8 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {/* Account Section */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Account</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Email</label>
              <p className="text-foreground font-medium">{userName}</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">About</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">Money Manager</p>
              <p>Version 1.0 - MongoDB & JWT Edition</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Features</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Secure JWT authentication</li>
                <li>MongoDB data storage</li>
                <li>Track income and expenses</li>
                <li>Visualize spending patterns</li>
                <li>Organize by categories</li>
                <li>Light and dark mode</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </main>

      <Navigation />
    </div>
  )
}
