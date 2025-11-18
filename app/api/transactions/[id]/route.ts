import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// DELETE /api/transactions/:id
export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    // ✅ unwrap params if it's a Promise
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("transactions");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (err: any) {
    console.error("[API] DELETE transaction error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
