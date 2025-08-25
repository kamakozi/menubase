"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface MenuCategory {
  id: string
  name: string
  description?: string
}

interface MenuCategoriesProps {
  categories: MenuCategory[]
}

export function MenuCategories({ categories }: MenuCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  if (!categories.length) return null

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 z-10 py-4 mb-8">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
          className="flex-shrink-0"
        >
          All Items
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="flex-shrink-0"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
