"use client"

import { type FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiCall } from "@/lib/api-client"
import { setToken, setUser } from "@/lib/token-storage"

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (mode === "signup" && password !== confirmPassword) {
        setError("Passwords do not match")
        setLoading(false)
        return
      }

      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup"
      const payload = mode === "login" ? { email, password } : { email, password, name }

      const response = await apiCall<any>(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      setToken(response.token)
      setUser(response.user)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isLogin = mode === "login"

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm font-medium">{error}</div>}

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>

        {/* Name (Signup only) */}
        {!isLogin && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        )}

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>

        {/* Confirm Password (Signup only) */}
        {!isLogin && (
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
        </button>
      </form>

      {/* Toggle Link */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
