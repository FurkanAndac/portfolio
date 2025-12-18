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
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return
    }

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
  }

  const handleImageLoad = (itemId: string) => {
    setLoadedImages((prev) => new Set(prev).add(itemId))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const isLoaded = loadedImages.has(item.id)
        const hasFailed = failedImages.has(item.id)
        const isLoading = !isLoaded && !hasFailed

        return (
          <div
            key={item.id}
            className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video bg-muted relative overflow-hidden">
              <img
                src={getScreenshotUrl(item.url) || "/placeholder.svg"}
                alt={`Screenshot of ${item.title}`}
                className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                onError={() => handleImageError(item.id)}
                onLoad={() => handleImageLoad(item.id)}
              />

              {isLoading && (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <div className="animate-pulse">
                    <Globe className="h-12 w-12 text-primary/40" />
                  </div>
                </div>
              )}

              {hasFailed && (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <Globe className="h-16 w-16 text-primary/40 mb-3" />
                  <p className="text-sm text-muted-foreground font-medium px-4 text-center">
                    {new URL(item.url).hostname}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Preview unavailable</p>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent md:inset-0 md:bg-black/60 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:flex md:items-center md:justify-center">
                <div className="flex items-center justify-end gap-2 md:justify-center">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors touch-manipulation"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Visit</span>
                  </a>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-destructive rounded-md hover:bg-destructive/90 transition-colors touch-manipulation"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                    <span className="text-white">Delete</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
              )}
              {item.category && (
                <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {item.category}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
