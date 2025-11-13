"use client"

import { useMemo } from "react"
import { Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
}

interface TransactionListProps {
  transactions: Transaction[]
  onDelete?: (id: string) => void
  filterType?: "all" | "income" | "expense"
  filterCategory?: string
  searchTerm?: string
}

export function TransactionList({
  transactions,
  onDelete,
  filterType = "all",
  filterCategory = "",
  searchTerm = "",
}: TransactionListProps) {
  const filtered = useMemo(() => {
    let result = transactions

    // Filter by type
    if (filterType !== "all") {
      result = result.filter((t) => t.type === filterType)
    }

    // Filter by category
    if (filterCategory) {
      result = result.filter((t) => t.category === filterCategory)
    }

    // Filter by search
    if (searchTerm) {
      result = result.filter(
        (t) =>
          t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort by date descending
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, filterType, filterCategory, searchTerm])

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    )
  }

  // Group by date
  const grouped = filtered.reduce(
    (acc, transaction) => {
      if (!acc[transaction.date]) {
        acc[transaction.date] = []
      }
      acc[transaction.date].push(transaction)
      return acc
    },
    {} as Record<string, Transaction[]>,
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateStr === today.toISOString().split("T")[0]) return "Today"
    if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday"

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, dateTransactions]) => (
        <div key={date}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-4 sm:px-0">
            {formatDate(date)}
          </p>
          <div className="space-y-2">
            {dateTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* Icon */}
                  <div
                    className={`p-2.5 rounded-lg ${
                      transaction.type === "income" ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{transaction.category}</p>
                    <p className="text-sm text-muted-foreground truncate">{transaction.description}</p>
                  </div>
                </div>

                {/* Amount & Delete */}
                <div className="flex items-center gap-3 ml-3">
                  <p
                    className={`font-semibold text-right ${
                      transaction.type === "income" ? "text-accent" : "text-destructive"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₨{transaction.amount.toLocaleString()}
                  </p>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/20 text-destructive transition-all"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
