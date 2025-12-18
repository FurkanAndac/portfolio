import type { PortfolioItem } from "./types"

export const portfolioStore = {
  getItems: async (): Promise<PortfolioItem[]> => {
    try {
      const response = await fetch("/api/portfolio", { cache: "no-store" })
      if (!response.ok) throw new Error("Failed to fetch items")
      return await response.json()
    } catch (error) {
      console.error("Error fetching items:", error)
      return []
    }
  },

  addItem: async (item: Omit<PortfolioItem, "id" | "createdAt">): Promise<PortfolioItem> => {
    const response = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })

    if (!response.ok) throw new Error("Failed to add item")
    return await response.json()
  },

  deleteItem: async (id: string): Promise<void> => {
    const response = await fetch(`/api/portfolio/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Failed to delete item")
  },
}
