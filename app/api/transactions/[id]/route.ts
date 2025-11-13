import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyToken, extractToken } from "@/lib/auth"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = extractToken(request.headers.get("authorization"))
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("e-com-mvp")
    const transactions = db.collection("transactions")

    // Verify ownership before deleting
    const transaction = await transactions.findOne({ _id: new ObjectId(id) })
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    if (transaction.userId.toString() !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await transactions.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
