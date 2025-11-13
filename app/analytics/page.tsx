"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"
import { Navigation } from "@/components/navigation"
import { SpendingPieChart } from "@/components/spending-pie-chart"
import { IncomeExpenseChart } from "@/components/income-expense-chart"
import { getUser, getToken, logout } from "@/lib/token-storage"
import { apiCall } from "@/lib/api-client"

interface Transaction {
  _id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const user = getUser()
        const token = getToken()

        if (!user || !token) {
          router.push("/login")
          return
        }

        const data = await apiCall<Transaction[]>("/api/transactions", {
          method: "GET",
        })
        setTransactions(data)
      } catch (err: any) {
        console.error("[v0] Error fetching transactions:", err)
        if (err.message === "Invalid token") {
          logout()
          router.push("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <DashboardHeader />

      <main className="sm:ml-64 px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Visualize your spending patterns</p>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <IncomeExpenseChart transactions={transactions} isDark={false} />
          <SpendingPieChart transactions={transactions} isDark={false} />
        </div>
      </main>

      <Navigation />
    </div>
  )
}
