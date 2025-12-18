import { getPortfolioItems } from "@/lib/portfolio-data"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import PortfolioGrid from "@/components/portfolio-grid"

export const dynamic = "force-dynamic"

export default async function PortfolioPage() {
  const items = await getPortfolioItems()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Portfolio</h1>
            <p className="text-muted-foreground mt-1">A collection of my work and projects</p>
          </div>
          <Link href="/admin">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add Link
            </Button>
          </Link>
        </div>
      </header>

      {/* Portfolio Grid */}
      <main className="container mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No portfolio items yet</h2>
            <p className="text-muted-foreground mb-6">Start by adding your first link</p>
            <Link href="/admin">
              <Button size="lg">Add Your First Link</Button>
            </Link>
          </div>
        ) : (
          <PortfolioGrid initialItems={items} />
        )}
      </main>
    </div>
  )
}
