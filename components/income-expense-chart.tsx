"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
}

interface IncomeExpenseChartProps {
  transactions: Transaction[]
  isDark?: boolean
}

export function IncomeExpenseChart({ transactions, isDark = false }: IncomeExpenseChartProps) {
  const data = useMemo(() => {
    // Get last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    return days.map((day) => {
      const dayTransactions = transactions.filter((t) => t.date === day)
      const income = dayTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
      const expense = dayTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      return {
        date: new Date(day + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        Income: income,
        Expense: expense,
      }
    })
  }, [transactions])

  return (
    <div className="w-full bg-card rounded-xl border border-border p-5">
      <h3 className="text-lg font-semibold text-foreground mb-4">Income vs Expense (Last 7 Days)</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" vertical={false} />
          <XAxis dataKey="date" stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
          <YAxis
            stroke="hsl(var(--color-muted-foreground))"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => `₨${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value) => `₨${(value as number).toLocaleString()}`}
            contentStyle={{
              backgroundColor: isDark ? "hsl(var(--color-card))" : "hsl(var(--color-card))",
              border: "1px solid hsl(var(--color-border))",
              borderRadius: "0.5rem",
            }}
          />
          <Legend />
          <Bar dataKey="Income" fill="hsl(var(--color-accent))" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Expense" fill="hsl(var(--color-destructive))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
