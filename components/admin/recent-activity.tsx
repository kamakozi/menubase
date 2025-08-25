"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@supabase/ssr"
import { Clock, Edit, Plus, DollarSign, Settings } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface Activity {
  id: string
  action_type: string
  description: string
  created_at: string
  metadata: any
}

export function RecentActivity({ restaurantId }: { restaurantId: string }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    if (restaurantId && restaurantId !== "undefined" && restaurantId !== "null") {
      fetchRecentActivity()
    } else {
      setLoading(false)
    }
  }, [restaurantId])

  const fetchRecentActivity = async () => {
    try {
      if (!restaurantId || restaurantId === "undefined" || restaurantId === "null") {
        console.log("[v0] Invalid restaurant ID, skipping activity fetch")
        setActivities([])
        return
      }

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      console.log("[v0] Fetching activity for restaurant:", restaurantId)

      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching activity:", error)
        return
      }

      console.log("[v0] Activity data fetched:", data?.length || 0, "items")
      setActivities(data || [])
    } catch (error) {
      console.error("Error fetching recent activity:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case "menu_item_added":
        return <Plus className="w-4 h-4 text-green-500" />
      case "menu_item_updated":
        return <Edit className="w-4 h-4 text-blue-500" />
      case "price_changed":
        return <DollarSign className="w-4 h-4 text-orange-500" />
      case "discount_added":
        return <DollarSign className="w-4 h-4 text-red-500" />
      case "restaurant_updated":
        return <Settings className="w-4 h-4 text-purple-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${t("minutesAgo") || "minutes ago"}`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} ${t("hoursAgo") || "hours ago"}`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} ${t("daysAgo") || "days ago"}`
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("recentActivity") || "Recent Activity"}</CardTitle>
          <CardDescription>{t("recentActivityDesc") || "Your latest menu updates and changes"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-24 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentActivity") || "Recent Activity"}</CardTitle>
        <CardDescription>{t("recentActivityDesc") || "Your latest menu updates and changes"}</CardDescription>
      </CardHeader>
      <CardContent>
        {!restaurantId || restaurantId === "undefined" || restaurantId === "null" ? (
          <p className="text-muted-foreground text-center py-8">
            {t("selectRestaurant") || "Please select a restaurant to view activity"}
          </p>
        ) : activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">{t("noRecentActivity") || "No recent activity"}</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-muted/50 rounded-lg px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.action_type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    {activity.metadata?.item_name && (
                      <p className="text-xs text-muted-foreground">{activity.metadata.item_name}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
