import type React from "react"

interface SummaryCardProps {
  title: string
  amount: number
  icon: React.ReactNode
  variant?: "default" | "income" | "expense"
}

export function SummaryCard({ title, amount, icon, variant = "default" }: SummaryCardProps) {
  const variantClasses = {
    default: "bg-card border-border",
    income: "bg-accent/5 border-accent/20",
    expense: "bg-destructive/5 border-destructive/20",
  }

  const textClasses = {
    default: "text-muted-foreground",
    income: "text-accent",
    expense: "text-destructive",
  }

  return (
    <div className={`rounded-xl border p-5 ${variantClasses[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium mb-1 ${textClasses[variant]}`}>{title}</p>
          <p className="text-2xl font-bold text-foreground">
            ₨{amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
        <div
          className={`p-2 rounded-lg ${variant === "income" ? "bg-accent/20 text-accent" : variant === "expense" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
