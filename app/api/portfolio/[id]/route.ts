import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// DELETE portfolio item
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const client = await clientPromise
    const db = client.db("portfolio")

    const result = await db.collection("items").deleteOne({
      $or: [{ id }, { _id: new ObjectId(id) }],
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting portfolio item:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
