import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("Money-manager")
    const users = db.collection("users")

    // Find user
    const user = await users.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate token
    const token = generateToken(user._id.toString())

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
