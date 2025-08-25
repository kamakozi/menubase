import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category_id?: string
  is_vegetarian: boolean
  is_vegan: boolean
  is_gluten_free: boolean
  allergens?: string[]
  menu_categories?: { name: string }
}

interface MenuCategory {
  id: string
  name: string
  description?: string
}

interface MenuItemsProps {
  items: MenuItem[]
  categories: MenuCategory[]
}

export function MenuItems({ items, categories }: MenuItemsProps) {
  // Group items by category
  const itemsByCategory = categories.reduce(
    (acc, category) => {
      acc[category.id] = items.filter((item) => item.category_id === category.id)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  // Items without category
  const uncategorizedItems = items.filter((item) => !item.category_id)

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const categoryItems = itemsByCategory[category.id]
        if (!categoryItems?.length) return null

        return (
          <section key={category.id} id={`category-${category.id}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
              {category.description && <p className="text-gray-600">{category.description}</p>}
            </div>

            <div className="grid gap-4">
              {categoryItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )
      })}

      {uncategorizedItems.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Other Items</h2>
          </div>

          <div className="grid gap-4">
            {uncategorizedItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <Card className="glass-card hover-lift group overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          {item.image_url && (
            <div className="w-28 h-28 md:w-36 md:h-36 flex-shrink-0 relative overflow-hidden">
              <Image
                src={item.image_url || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-serif font-semibold text-foreground text-xl group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <div className="ml-6 text-right">
                <span className="text-2xl font-bold text-primary">€{item.price.toFixed(2)}</span>
              </div>
            </div>

            {item.description && <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>}

            <div className="flex flex-wrap gap-2">
              {item.is_vegetarian && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                >
                  🌱 Vegetarian
                </Badge>
              )}
              {item.is_vegan && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                >
                  🌿 Vegan
                </Badge>
              )}
              {item.is_gluten_free && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  🌾 Gluten Free
                </Badge>
              )}
              {item.allergens && item.allergens.length > 0 && (
                <Badge variant="outline" className="text-xs hover:bg-muted transition-colors">
                  ⚠️ Allergens: {item.allergens.join(", ")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
