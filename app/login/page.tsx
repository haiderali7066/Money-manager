import { AuthForm } from "@/components/auth-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to manage your finances</p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <AuthForm mode="login" />
        </div>
      </div>
    </main>
  )
}
