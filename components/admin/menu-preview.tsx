"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClassicTemplate } from "@/components/menu/templates/classic-template"
import { ModernTemplate } from "@/components/menu/templates/modern-template"
import { ElegantTemplate } from "@/components/menu/templates/elegant-template"
import { MinimalTemplate } from "@/components/menu/templates/minimal-template"
import { useLanguage } from "@/hooks/use-language"

interface Restaurant {
  id: string
  name: string
  slug?: string
  menu_template?: string
  description?: string
  address?: string
  phone?: string
}

interface MenuCategory {
  id: string
  name: string
  description?: string
  display_order: number
  is_active: boolean
}

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  category_id?: string
  is_vegetarian: boolean
  is_vegan: boolean
  is_gluten_free: boolean
  is_available: boolean
  is_daily_special: boolean
  menu_categories?: { name: string }
}

interface MenuPreviewProps {
  restaurant: Restaurant
  categories: MenuCategory[]
  menuItems: MenuItem[]
}

export function MenuPreview({ restaurant, categories, menuItems }: MenuPreviewProps) {
  const { t } = useLanguage()
  const template = restaurant.menu_template || "classic"

  const renderTemplate = () => {
    const dailySpecials = menuItems.filter((item) => item.is_daily_special)
    const props = { restaurant, categories, menuItems, dailySpecials }

    switch (template) {
      case "modern":
        return <ModernTemplate {...props} />
      case "elegant":
        return <ElegantTemplate {...props} />
      case "minimal":
        return <MinimalTemplate {...props} />
      default:
        return <ClassicTemplate {...props} />
    }
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t("preview")} - {restaurant.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="max-h-[800px] overflow-y-auto">{renderTemplate()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
