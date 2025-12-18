import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { PortfolioItem } from "@/lib/types"

// GET all portfolio items
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("portfolio")
    const items = await db.collection<PortfolioItem>("items").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(items)
  } catch (error) {
    console.error("[v0] Error fetching portfolio items:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

// POST new portfolio item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, url, description, category } = body

    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("portfolio")

    const newItem: PortfolioItem = {
      id: crypto.randomUUID(),
      title,
      url,
      description: description || "",
      category: category || "",
      createdAt: new Date().toISOString(),
    }

    await db.collection("items").insertOne(newItem)

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating portfolio item:", error)
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}
