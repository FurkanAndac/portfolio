"use client"

import type React from "react"

import { useState } from "react"
import { portfolioStore } from "@/lib/portfolio-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ArrowLeft, LinkIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await portfolioStore.addItem(formData)

      // Reset form
      setFormData({
        title: "",
        url: "",
        description: "",
        category: "",
      })

      // Redirect to home
      router.push("/")
    } catch (error) {
      console.error("Error adding item:", error)
      alert("Failed to add item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Button>
        </Link>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <LinkIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Add New Link</h1>
              <p className="text-muted-foreground">Add a URL to showcase in your portfolio</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="My Awesome Project"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A brief description of this project..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Web Design, Development, etc."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add to Portfolio"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
