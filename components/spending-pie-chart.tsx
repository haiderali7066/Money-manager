"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
}

interface SpendingPieChartProps {
  transactions: Transaction[]
  isDark?: boolean
}

const COLORS = [
  "hsl(var(--color-chart-1))",
  "hsl(var(--color-chart-2))",
  "hsl(var(--color-chart-3))",
  "hsl(var(--color-chart-4))",
  "hsl(var(--color-chart-5))",
]

export function SpendingPieChart({ transactions, isDark = false }: SpendingPieChartProps) {
  const data = useMemo(() => {
    const expensesByCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, transaction) => {
          const existing = acc.find((item) => item.name === transaction.category)
          if (existing) {
            existing.value += transaction.amount
          } else {
            acc.push({ name: transaction.category, value: transaction.amount })
          }
          return acc
        },
        [] as { name: string; value: number }[],
      )
      .sort((a, b) => b.value - a.value)

    return expensesByCategory
  }, [transactions])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground">No expense data available</p>
      </div>
    )
  }

  const totalExpense = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-full bg-card rounded-xl border border-border p-5">
      <h3 className="text-lg font-semibold text-foreground mb-4">Spending by Category</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₨${(value as number).toLocaleString()}`}
              contentStyle={{
                backgroundColor: isDark ? "hsl(var(--color-card))" : "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
                borderRadius: "0.5rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend & Stats */}
        <div className="space-y-3">
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">₨{item.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{((item.value / totalExpense) * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">Total Spending</p>
            <p className="text-xl font-bold text-primary">₨{totalExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
