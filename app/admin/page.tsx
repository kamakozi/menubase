import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { RestaurantOverview } from "@/components/admin/restaurant-overview"
import { QuickActions } from "@/components/admin/quick-actions"
import { RecentActivity } from "@/components/admin/recent-activity"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  if (!user.email_confirmed_at) {
    redirect("/auth/confirm-email")
  }

  // Get user's restaurants
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardHeader user={user} profile={profile} restaurants={restaurants || []} />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-2 sm:mb-4">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Manage your {restaurants?.length === 1 ? "restaurant menu" : "restaurant menus"} and grow your business
          </p>
        </div>

        <div className="grid gap-4 sm:gap-8 lg:grid-cols-3 animate-slide-up">
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            <RestaurantOverview restaurants={restaurants || []} />
            <RecentActivity restaurantId={restaurants?.[0]?.id || ""} />
          </div>

          <div className="space-y-4 sm:space-y-8">
            <QuickActions restaurants={restaurants || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
