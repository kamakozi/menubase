"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Globe, Crown, AlertCircle } from "lucide-react"
import { useSubscription } from "@/hooks/use-subscription"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Restaurant {
  id: string
  name: string
  description?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  slug: string
  is_active: boolean
  custom_domain?: string
  domain_changes_count?: number
  last_domain_change?: string
}

interface RestaurantSettingsProps {
  restaurant: Restaurant
}

export function RestaurantSettings({ restaurant }: RestaurantSettingsProps) {
  const { planType, hasCustomDomain } = useSubscription()
  const [loading, setLoading] = useState(false)
  const [customDomain, setCustomDomain] = useState(restaurant.custom_domain || "")
  const [domainChangesThisMonth, setDomainChangesThisMonth] = useState(0)

  const supabase = createClient()

  const isPremium = hasCustomDomain()

  useEffect(() => {
    // Calculate domain changes this month
    if (restaurant.last_domain_change) {
      const lastChange = new Date(restaurant.last_domain_change)
      const now = new Date()
      const isThisMonth = lastChange.getMonth() === now.getMonth() && lastChange.getFullYear() === now.getFullYear()

      if (isThisMonth) {
        setDomainChangesThisMonth(restaurant.domain_changes_count || 0)
      }
    }
  }, [restaurant])

  const handleSaveCustomDomain = async () => {
    if (!isPremium) {
      toast.error("Custom domains are only available for Premium users")
      return
    }

    if (domainChangesThisMonth >= 2) {
      toast.error("You can only change your custom domain 2 times per month")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from("restaurants")
        .update({
          custom_domain: customDomain,
          domain_changes_count: domainChangesThisMonth + 1,
          last_domain_change: new Date().toISOString(),
        })
        .eq("id", restaurant.id)

      if (error) throw error

      toast.success("Custom domain updated successfully!")
      setDomainChangesThisMonth(domainChangesThisMonth + 1)
    } catch (error) {
      console.error("Error updating custom domain:", error)
      toast.error("Failed to update custom domain")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Information</CardTitle>
          <CardDescription>Update your restaurant's basic information and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input id="name" defaultValue={restaurant.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Menu URL</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  smartmenu.at/
                </span>
                <Input id="slug" defaultValue={restaurant.slug} className="rounded-l-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue={restaurant.description || ""}
              placeholder="Tell customers about your restaurant..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue={restaurant.phone || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={restaurant.email || ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" defaultValue={restaurant.address || ""} />
          </div>

          {/* Removed website field as SmartMenu creates the websites automatically */}

          <div className="flex items-center space-x-2">
            <Switch id="is_active" defaultChecked={restaurant.is_active} />
            <Label htmlFor="is_active">Restaurant is active and visible to customers</Label>
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Added custom domain functionality for premium users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-violet-600" />
            Custom Domain
            {isPremium ? (
              <Badge variant="default" className="bg-violet-100 text-violet-700">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            ) : (
              <Badge variant="outline">Premium Feature</Badge>
            )}
          </CardTitle>
          <CardDescription>
            {isPremium
              ? "Use your own domain for your menu (e.g., menu.yourrestaurant.com)"
              : "Upgrade to Premium to use your own custom domain"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPremium ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain</Label>
                <Input
                  id="customDomain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="menu.yourrestaurant.com"
                  disabled={!isPremium}
                />
                <p className="text-sm text-gray-500">Enter your custom domain without http:// or https://</p>
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-700">
                  Domain changes remaining this month: <strong>{2 - domainChangesThisMonth}</strong>
                </p>
              </div>

              <Button onClick={handleSaveCustomDomain} disabled={loading || domainChangesThisMonth >= 2}>
                {loading ? "Updating..." : "Update Custom Domain"}
              </Button>

              {restaurant.custom_domain && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Current custom domain:</strong> {restaurant.custom_domain}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Make sure to point your domain's DNS to our servers for it to work properly.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <Crown className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-3">Custom domains are available with Premium plans</p>
              <Button variant="outline">Upgrade to Premium</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu Appearance</CardTitle>
          <CardDescription>Customize how your menu looks to customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo Image</Label>
            <Input id="logo" type="file" accept="image/*" />
            <p className="text-sm text-gray-500">Upload your restaurant logo (recommended: 200x200px)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image</Label>
            <Input id="cover" type="file" accept="image/*" />
            <p className="text-sm text-gray-500">Upload a cover image for your menu (recommended: 1200x400px)</p>
          </div>

          <Button>Update Images</Button>
        </CardContent>
      </Card>
    </div>
  )
}
