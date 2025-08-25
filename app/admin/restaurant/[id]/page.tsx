import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { RestaurantSettings } from "@/components/admin/restaurant-settings"
import { MenuManagement } from "@/components/admin/menu-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RestaurantPageProps {
  params: Promise<{ id: string }>
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get restaurant data
  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single()

  if (restaurantError || !restaurant) {
    notFound()
  }

  const { data: allRestaurants } = await supabase
    .from("restaurants")
    .select("id, name, slug, is_active")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  // Get menu categories
  const { data: categories } = await supabase
    .from("menu_categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("display_order")

  // Get menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select(`
      *,
      menu_categories(name)
    `)
    .eq("restaurant_id", restaurant.id)
    .order("display_order")

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        user={user}
        profile={profile}
        restaurants={allRestaurants || []}
        currentRestaurantId={restaurant.id}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
          <p className="text-gray-600">Manage your restaurant settings and menu</p>
        </div>

        <Tabs defaultValue="menu" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="settings">Restaurant Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-8">
            <MenuManagement restaurant={restaurant} categories={categories || []} menuItems={menuItems || []} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            <RestaurantSettings restaurant={restaurant} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
