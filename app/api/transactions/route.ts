import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyToken, extractToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get("authorization"))
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("Money-manager")
    const transactions = db.collection("transactions")

    // Get transactions for this user only
    const userTransactions = await transactions
      .find({ userId: new ObjectId(decoded.userId) })
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json(userTransactions)
  } catch (error) {
    console.error("Get transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get("authorization"))
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { type, amount, category, description, date } = await request.json()

    if (!type || !amount || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("Money-manager")
    const transactions = db.collection("transactions")

    const result = await transactions.insertOne({
      userId: new ObjectId(decoded.userId),
      type,
      amount: Number.parseFloat(amount),
      category,
      description: description || "",
      date: date ? new Date(date) : new Date(),
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        id: result.insertedId,
        userId: decoded.userId,
        type,
        amount,
        category,
        description,
        date,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
