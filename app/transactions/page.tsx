"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"
import { Navigation } from "@/components/navigation"
import { TransactionList } from "@/components/transaction-list"
import { AddTransactionModal } from "@/components/add-transaction-modal"
import { Plus, Search } from "lucide-react"
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

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Bonus", "Other"],
  expense: ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Healthcare", "Other"],
}

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterCategory, setFilterCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
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

  const handleAddTransaction = async (transaction: Omit<Transaction, "_id">) => {
    try {
      const newTransaction = await apiCall<Transaction>("/api/transactions", {
        method: "POST",
        body: JSON.stringify(transaction),
      })
      setTransactions([newTransaction, ...transactions])
      setModalOpen(false)
    } catch (err: any) {
      console.error("[v0] Error adding transaction:", err)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await apiCall(`/api/transactions/${id}`, {
        method: "DELETE",
      })
      setTransactions(transactions.filter((t) => t._id !== id))
    } catch (err: any) {
      console.error("[v0] Error deleting transaction:", err)
    }
  }

  const categories = filterType === "all" ? [...CATEGORIES.income, ...CATEGORIES.expense] : CATEGORIES[filterType]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <DashboardHeader />

      <main className="sm:ml-64 px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-24 sm:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground mt-1">Manage and view all your transactions</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-4 bg-card rounded-xl border border-border p-4 sm:p-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search category or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Type Filter */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button
              onClick={() => {
                setFilterType("all")
                setFilterCategory("")
              }}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                filterType === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilterType("income")
                setFilterCategory("")
              }}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                filterType === "income"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Income
            </button>
            <button
              onClick={() => {
                setFilterType("expense")
                setFilterCategory("")
              }}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                filterType === "expense"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Expense
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <TransactionList
          transactions={transactions}
          onDelete={handleDeleteTransaction}
          filterType={filterType}
          filterCategory={filterCategory}
          searchTerm={searchTerm}
        />

        {/* Mobile FAB */}
        <button
          onClick={() => setModalOpen(true)}
          className="sm:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Add transaction"
        >
          <Plus className="w-6 h-6" />
        </button>
      </main>

      <Navigation />

      <AddTransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAddTransaction} />
    </div>
  )
}
