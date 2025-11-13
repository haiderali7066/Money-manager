"use client"

import { type FormEvent, useState } from "react"
import { X } from "lucide-react"

interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
}

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (transaction: Transaction) => void
}

const EXPENSE_CATEGORIES = ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Healthcare", "Other"]

const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Bonus", "Other"]

export function AddTransactionModal({ isOpen, onClose, onAdd }: AddTransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!category || !amount) {
      alert("Please fill all fields")
      return
    }

    const newTransaction: Transaction = {
      id: Math.random().toString(),
      type,
      category,
      amount: Number.parseFloat(amount),
      description,
      date,
    }

    onAdd(newTransaction)
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setType("expense")
    setCategory("")
    setAmount("")
    setDescription("")
    setDate(new Date().toISOString().split("T")[0])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-20 pb-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl border border-border shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <h2 className="text-xl font-bold text-foreground">Add Transaction</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors" aria-label="Close">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Toggle */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setType("expense")
                setCategory("")
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                type === "expense"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType("income")
                setCategory("")
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                type === "income" ? "bg-accent text-accent-foreground" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Income
            </button>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Amount (PKR)</label>
            <div className="flex items-center">
              <span className="text-lg font-bold text-primary mr-2">₨</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
                min="0"
                step="0.01"
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  )
}
