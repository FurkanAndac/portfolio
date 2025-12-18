"use client"

import { useState } from "react"
import type { PortfolioItem } from "@/lib/types"
import { portfolioStore } from "@/lib/portfolio-store"
import { ExternalLink, Trash2, Globe } from "lucide-react"

interface PortfolioGridProps {
  initialItems: PortfolioItem[]
}

export default function PortfolioGrid({ initialItems }: PortfolioGridProps) {
  const [items, setItems] = useState(initialItems)
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set(initialItems.map((item) => item.id)))
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  const handleDelete = async (id: string) => {
    try {
      await portfolioStore.deleteItem(id)
      setItems(items.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Failed to delete item. Please try again.")
    }
  }

  const getScreenshotUrl = (url: string) => {
    return `/api/screenshot?url=${encodeURIComponent(url)}`
  }

  const handleImageError = (itemId: string) => {
    setFailedImages((prev) => new Set(prev).add(itemId))
    setLoadingImages((prev) => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const handleImageLoad = (itemId: string) => {
    setLoadingImages((prev) => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-video bg-muted relative overflow-hidden">
            <img
              src={getScreenshotUrl(item.url) || "/placeholder.svg"}
              alt={`Screenshot of ${item.title}`}
              className={`w-full h-full object-cover object-top ${loadingImages.has(item.id) || failedImages.has(item.id) ? "hidden" : ""}`}
              onError={() => handleImageError(item.id)}
              onLoad={() => handleImageLoad(item.id)}
            />

            {loadingImages.has(item.id) && !failedImages.has(item.id) && (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="animate-pulse">
                  {/* <Globe className="h-12 w-12 text-primary/40" /> */}
                </div>
              </div>
            )}

            {failedImages.has(item.id) && (
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <Globe className="h-16 w-16 text-primary/40 mb-3" />
                <p className="text-sm text-muted-foreground font-medium px-4 text-center">
                  {new URL(item.url).hostname}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">Preview unavailable</p>
              </div>
            )}

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Visit
              </a>
              <button
                onClick={() => handleDelete(item.id)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-destructive rounded-md hover:bg-destructive/90 transition-colors"
              >
                <Trash2 className="h-4 w-4 text-white" />
                <span className="text-white">Delete</span>
              </button>
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
            {item.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>}
            {item.category && (
              <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {item.category}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
