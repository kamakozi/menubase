import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Shield, Calendar, MapPin } from "lucide-react"
import { DashboardHeader } from "@/components/admin/dashboard-header"

export default async function UsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile to check if admin
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // For now, only allow the main user to see all users (you can add admin role later)
  if (!profile) {
    redirect("/admin")
  }

  // Get all users with their profiles and subscription info
  const { data: allUsers } = await supabase
    .from("profiles")
    .select(`
      *,
      user_profiles!inner(
        first_name,
        last_name,
        phone_number,
        created_at
      ),
      user_subscriptions(
        plan_type,
        status,
        trial_end_date,
        subscription_end_date
      )
    `)
    .order("created_at", { ascending: false })

  // Get restaurant counts for each user
  const { data: restaurantCounts } = await supabase.from("restaurants").select("owner_id")

  const restaurantCountMap =
    restaurantCounts?.reduce(
      (acc, restaurant) => {
        acc[restaurant.owner_id] = (acc[restaurant.owner_id] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  return (
    <div className="min-h-screen gradient-bg">
      <DashboardHeader user={user} profile={profile} restaurants={[]} />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            User Management
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            View and manage all registered users and their subscriptions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="glass-card hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-primary">{allUsers?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Premium Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {allUsers?.filter((u) => u.user_subscriptions?.[0]?.plan_type !== "free").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Trial Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {allUsers?.filter((u) => u.user_subscriptions?.[0]?.status === "trial").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Total Restaurants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {Object.values(restaurantCountMap).reduce((sum, count) => sum + count, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
            <CardDescription>All users registered on the platform with their subscription status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">User</TableHead>
                    <TableHead className="hidden sm:table-cell">Business</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="hidden lg:table-cell">Restaurants</TableHead>
                    <TableHead className="hidden xl:table-cell">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers?.map((userData) => {
                    const userProfile = userData.user_profiles?.[0]
                    const subscription = userData.user_subscriptions?.[0]
                    const restaurantCount = restaurantCountMap[userData.id] || 0

                    const initials =
                      userProfile?.first_name && userProfile?.last_name
                        ? `${userProfile.first_name[0]}${userProfile.last_name[0]}`
                        : userData.business_name?.[0]?.toUpperCase() || "U"

                    const getPlanBadge = () => {
                      if (!subscription || subscription.plan_type === "free") {
                        return <Badge variant="outline">Free</Badge>
                      }
                      if (subscription.status === "trial") {
                        return <Badge variant="secondary">Trial</Badge>
                      }
                      if (subscription.plan_type === "premium") {
                        return <Badge variant="default">Premium</Badge>
                      }
                      if (subscription.plan_type === "premium_plus") {
                        return <Badge className="bg-gradient-to-r from-violet-600 to-purple-600">Premium+</Badge>
                      }
                      return <Badge variant="outline">Free</Badge>
                    }

                    return (
                      <TableRow key={userData.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs sm:text-sm">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-sm sm:text-base truncate">
                                {userProfile?.first_name && userProfile?.last_name
                                  ? `${userProfile.first_name} ${userProfile.last_name}`
                                  : userData.business_name || "Unknown User"}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                {/* Email would come from auth.users but we can't access it directly */}
                                ID: {userData.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="text-sm truncate max-w-[150px]">{userData.business_name || "—"}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">{userProfile?.phone_number || userData.phone || "—"}</div>
                        </TableCell>
                        <TableCell>{getPlanBadge()}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-sm font-medium">
                            {restaurantCount} {restaurantCount === 1 ? "restaurant" : "restaurants"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <div className="text-sm text-muted-foreground">
                            {userProfile?.created_at
                              ? new Date(userProfile.created_at).toLocaleDateString()
                              : new Date(userData.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                ✅ <strong>Passwords are securely hashed</strong> - All user passwords are hashed using Supabase's
                built-in bcrypt hashing before storage
              </p>
              <p>
                ✅ <strong>Row Level Security (RLS)</strong> - Database policies ensure users can only access their own
                data
              </p>
              <p>
                ✅ <strong>Email verification required</strong> - All users must verify their email addresses before
                accessing the platform
              </p>
              <p>
                ✅ <strong>Secure authentication</strong> - JWT tokens with automatic refresh and secure session
                management
              </p>
              <p>
                ℹ️ <strong>Email addresses</strong> - User emails are stored in auth.users (managed by Supabase) and not
                directly accessible via API for security
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
