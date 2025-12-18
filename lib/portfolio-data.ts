import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import type { PortfolioItem } from "./types"

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const client = await clientPromise
    const db = client.db("portfolio")
    const collection = db.collection("items")

    const items = await collection.find({}).sort({ createdAt: -1 }).toArray()

    return items.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      url: item.url,
      description: item.description,
      category: item.category,
      createdAt: item.createdAt,
    }))
  } catch (error) {
    console.error("Error fetching portfolio items:", error)
    return []
  }
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const client = await clientPromise
  const db = client.db("portfolio")
  const collection = db.collection("items")

  await collection.deleteOne({ _id: new ObjectId(id) })
}
