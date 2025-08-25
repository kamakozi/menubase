"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ExternalLink, Settings, Building2, Calendar, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Restaurant {
  id: string
  name: string
  description?: string
  slug: string
  is_active: boolean
  created_at: string
}

interface RestaurantOverviewProps {
  restaurants: Restaurant[]
}

export function RestaurantOverview({ restaurants }: RestaurantOverviewProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  const handleDeleteRestaurant = async (restaurantId: string, restaurantName: string) => {
    if (!confirm(`Are you sure you want to delete "${restaurantName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(restaurantId)
    try {
      const { error } = await supabase.from("restaurants").delete().eq("id", restaurantId)

      if (error) throw error

      // Refresh the page to update the restaurant list
      window.location.reload()
    } catch (error) {
      console.error("Error deleting restaurant:", error)
      alert("Failed to delete restaurant. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card className="glass-card hover-lift">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-serif flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            Your Restaurants
          </CardTitle>
          <CardDescription className="text-base mt-2">Manage your restaurant menus and settings</CardDescription>
        </div>
        <Button className="hover-lift group" asChild>
          <Link href="/admin/restaurant/new">
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
            Add Restaurant
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {restaurants.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-3">No restaurants yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first restaurant to start building beautiful digital menus for your customers.
            </p>
            <Button size="lg" className="hover-lift group" asChild>
              <Link href="/admin/restaurant/new">
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                Create Your First Restaurant
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {restaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="glass-card p-6 hover-lift group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                        {restaurant.name}
                      </h3>
                      <Badge
                        variant={restaurant.is_active ? "default" : "secondary"}
                        className={restaurant.is_active ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                      >
                        {restaurant.is_active ? "🟢 Active" : "⚪ Inactive"}
                      </Badge>
                    </div>

                    {restaurant.description && (
                      <p className="text-muted-foreground mb-4 leading-relaxed">{restaurant.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-primary" />
                        <span className="font-mono">smartmenu.at/{restaurant.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Created {new Date(restaurant.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-6">
                    <Button variant="outline" size="sm" className="hover-lift bg-transparent" asChild>
                      <Link href={`/menu/${restaurant.slug}`} target="_blank">
                        <ExternalLink className="w-4 h-4" />
                        <span className="sr-only">View menu</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="hover-lift bg-transparent" asChild>
                      <Link href={`/admin/restaurant/${restaurant.id}`}>
                        <Settings className="w-4 h-4" />
                        <span className="sr-only">Settings</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover-lift bg-transparent text-red-600 hover:text-red-700 hover:border-red-300"
                      onClick={() => handleDeleteRestaurant(restaurant.id, restaurant.name)}
                      disabled={deletingId === restaurant.id}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete restaurant</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
