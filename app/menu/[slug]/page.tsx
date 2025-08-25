import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

interface MenuPageProps {
  params: Promise<{ slug: string }>
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch restaurant data
  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (restaurantError || !restaurant) {
    notFound()
  }

  // Fetch menu categories
  const { data: categories } = await supabase
    .from("menu_categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .order("display_order")

  // Fetch menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select(`
      *,
      menu_categories(name)
    `)
    .eq("restaurant_id", restaurant.id)
    .eq("is_available", true)
    .order("display_order")

  // Fetch daily specials
  const { data: dailySpecials } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("is_daily_special", true)
    .eq("is_available", true)
    .order("display_order")

  const templateName = restaurant.menu_template || "classic"

  if (templateName === "modern") {
    const { ModernTemplate } = await import("@/components/menu/templates/modern-template")
    return (
      <ModernTemplate
        restaurant={restaurant}
        categories={categories || []}
        menuItems={menuItems || []}
        dailySpecials={dailySpecials || []}
      />
    )
  }

  if (templateName === "elegant") {
    const { ElegantTemplate } = await import("@/components/menu/templates/elegant-template")
    return (
      <ElegantTemplate
        restaurant={restaurant}
        categories={categories || []}
        menuItems={menuItems || []}
        dailySpecials={dailySpecials || []}
      />
    )
  }

  if (templateName === "minimal") {
    const { MinimalTemplate } = await import("@/components/menu/templates/minimal-template")
    return (
      <MinimalTemplate
        restaurant={restaurant}
        categories={categories || []}
        menuItems={menuItems || []}
        dailySpecials={dailySpecials || []}
      />
    )
  }

  // Default classic template (free)
  const { ClassicTemplate } = await import("@/components/menu/templates/classic-template")
  return (
    <ClassicTemplate
      restaurant={restaurant}
      categories={categories || []}
      menuItems={menuItems || []}
      dailySpecials={dailySpecials || []}
    />
  )
}

export async function generateMetadata({ params }: MenuPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!restaurant) {
    return {
      title: "Menu Not Found - SmartMenu",
    }
  }

  return {
    title: `${restaurant.name} - Menu | SmartMenu`,
    description: restaurant.description || `View the digital menu for ${restaurant.name}`,
  }
}
