import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 mb-4">
            <span className="text-2xl font-bold text-primary">₨</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Money Manager</h1>
          <p className="text-lg text-muted-foreground">Take control of your finances with ease</p>
        </div>

        {/* Features */}
        <div className="space-y-3 text-left">
          <div className="flex gap-3 items-start p-3 rounded-lg bg-card border border-border">
            <div className="text-primary font-bold text-lg mt-1">✓</div>
            <div>
              <p className="font-medium text-foreground">Track Income & Expenses</p>
              <p className="text-sm text-muted-foreground">Organize your transactions by category</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-3 rounded-lg bg-card border border-border">
            <div className="text-accent font-bold text-lg mt-1">✓</div>
            <div>
              <p className="font-medium text-foreground">Visual Analytics</p>
              <p className="text-sm text-muted-foreground">See spending patterns at a glance</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-3 rounded-lg bg-card border border-border">
            <div className="text-primary font-bold text-lg mt-1">✓</div>
            <div>
              <p className="font-medium text-foreground">Real-time Dashboard</p>
              <p className="text-sm text-muted-foreground">Your balance always up to date</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/signup"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full px-6 py-3 bg-card text-foreground font-semibold rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}
