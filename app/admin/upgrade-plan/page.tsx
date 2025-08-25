import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/admin/dashboard-header"

export default async function UpgradePlanPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // For developers/testing: Upgrade to premium automatically
  const handleDeveloperUpgrade = async () => {
    "use server"

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // Create or update subscription to premium with 14-day trial
    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + 14)

    await supabase.from("user_subscriptions").upsert({
      user_id: user.id,
      plan_type: "premium",
      status: "trial",
      trial_start_date: new Date().toISOString(),
      trial_end_date: trialEndDate.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    redirect("/admin?upgraded=true")
  }

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardHeader user={user} profile={profile} restaurants={[]} />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">Developer Plan Upgrade</h1>
          <p className="text-muted-foreground text-lg mb-8">
            As a developer, you can upgrade to Premium for free to test all features
          </p>

          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Premium Developer Access</h2>
            <div className="space-y-3 text-left mb-6">
              <p className="flex items-center gap-2">
                ✅ <span>14-day free Premium trial</span>
              </p>
              <p className="flex items-center gap-2">
                ✅ <span>Access to all premium templates</span>
              </p>
              <p className="flex items-center gap-2">
                ✅ <span>Visual menu editor</span>
              </p>
              <p className="flex items-center gap-2">
                ✅ <span>Custom domain support</span>
              </p>
              <p className="flex items-center gap-2">
                ✅ <span>Analytics dashboard</span>
              </p>
              <p className="flex items-center gap-2">
                ✅ <span>Up to 4 restaurants</span>
              </p>
            </div>

            <form action={handleDeveloperUpgrade}>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                Activate Premium Trial (Free for Developers)
              </button>
            </form>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>This upgrade is for development and testing purposes only.</p>
            <p>Production deployments should use proper payment integration.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
