import { AuthForm } from "@/components/auth-form"

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground">Start tracking your finances today</p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <AuthForm mode="signup" />
        </div>
      </div>
    </main>
  )
}
