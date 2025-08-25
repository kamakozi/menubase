"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, CreditCard, Building, Phone, Calendar } from "lucide-react"

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  business_name: string
  phone: string
  phone_number: string
  subscription_plan: string
  subscription_status: string
  created_at: string
  profile_picture_url?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      console.log("[v0] Fetching user profile...")
      setError(null)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.log("[v0] User auth error:", userError)
        setError("Authentication error")
        return
      }

      if (!user) {
        console.log("[v0] No authenticated user found")
        setError("No authenticated user")
        return
      }

      console.log("[v0] User found:", user.id)

      const [profilesResult, userProfilesResult, subscriptionResult] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("user_subscriptions").select("*").eq("user_id", user.id).single(),
      ])

      console.log("[v0] Profiles result:", profilesResult)
      console.log("[v0] User profiles result:", userProfilesResult)
      console.log("[v0] Subscription result:", subscriptionResult)

      const profileData = profilesResult.data
      const userProfileData = userProfilesResult.data
      const subscriptionData = subscriptionResult.data

      setProfile({
        id: user.id,
        email: user.email || "",
        first_name: profileData?.first_name || userProfileData?.first_name || "",
        last_name: profileData?.last_name || userProfileData?.last_name || "",
        business_name: profileData?.business_name || "",
        phone: profileData?.phone || "",
        phone_number: userProfileData?.phone_number || "",
        profile_picture_url: userProfileData?.profile_picture_url || "",
        subscription_plan: subscriptionData?.plan_type || "free",
        subscription_status: subscriptionData?.status || "active",
        created_at: profileData?.created_at || userProfileData?.created_at || user.created_at,
      })

      console.log("[v0] Profile data loaded successfully")
    } catch (error) {
      console.error("[v0] Error fetching profile:", error)
      setError("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return

    setUpdating(true)
    try {
      console.log("[v0] Updating profile with:", updates)

      const profileUpdates = {
        first_name: updates.first_name,
        last_name: updates.last_name,
        business_name: updates.business_name,
        phone: updates.phone,
      }

      const userProfileUpdates = {
        first_name: updates.first_name,
        last_name: updates.last_name,
        phone_number: updates.phone_number,
      }

      const [profileResult, userProfileResult] = await Promise.all([
        supabase.from("profiles").upsert({ id: profile.id, ...profileUpdates }),
        supabase.from("user_profiles").upsert({ user_id: profile.id, ...userProfileUpdates }),
      ])

      if (profileResult.error) {
        console.error("[v0] Profile update error:", profileResult.error)
      }

      if (userProfileResult.error) {
        console.error("[v0] User profile update error:", userProfileResult.error)
      }

      if (!profileResult.error && !userProfileResult.error) {
        setProfile({ ...profile, ...updates })
        console.log("[v0] Profile updated successfully")
      }
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
    } finally {
      setUpdating(false)
    }
  }

  const resetPassword = async () => {
    if (!profile?.email) return

    try {
      const response = await fetch("/api/send-password-reset-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
          resetToken: crypto.randomUUID(), // Generate secure token
          firstName: profile.first_name,
        }),
      })

      if (response.ok) {
        alert("Password reset email sent! Check your inbox.")
      } else {
        throw new Error("Failed to send reset email")
      }
    } catch (error) {
      console.error("Error sending reset email:", error)
      alert("Failed to send reset email. Please try again.")
    }
  }

  const handleUpgrade = () => {
    window.location.href = "/admin/billing?plan=premium"
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-6">
            <div className="text-red-500 mb-4">
              <Shield className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Loading Error</h2>
            <p className="text-gray-600 mb-4">{error || "Unable to load your profile information."}</p>
            <Button onClick={fetchProfile} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>
        <Badge variant={profile.subscription_plan === "premium" ? "default" : "secondary"} className="w-fit">
          {profile.subscription_plan === "premium" ? "Premium User" : "Free User"}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your personal details and business information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.last_name}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="businessName" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Business Name
              </Label>
              <Input
                id="businessName"
                value={profile.business_name}
                onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone || profile.phone_number}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value, phone_number: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </Label>
                <Input value={new Date(profile.created_at).toLocaleDateString()} disabled className="bg-gray-50 mt-1" />
              </div>
            </div>

            <Button
              onClick={() =>
                updateProfile({
                  first_name: profile.first_name,
                  last_name: profile.last_name,
                  business_name: profile.business_name,
                  phone: profile.phone || profile.phone_number,
                  phone_number: profile.phone || profile.phone_number,
                })
              }
              disabled={updating}
              className="w-full sm:w-auto"
            >
              {updating ? "Updating..." : "Update Information"}
            </Button>
          </CardContent>
        </Card>

        {/* Account & Security */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email Address</Label>
                <Input value={profile.email} disabled className="bg-gray-50 mt-1" />
                <p className="text-xs text-gray-500 mt-1">Contact support to change email</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={resetPassword} className="w-full bg-transparent">
                Reset Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Current Plan</span>
                  <Badge variant={profile.subscription_plan === "premium" ? "default" : "secondary"}>
                    {profile.subscription_plan.charAt(0).toUpperCase() + profile.subscription_plan.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Status: {profile.subscription_status}</p>
              </div>
              {profile.subscription_plan === "free" && (
                <Button onClick={handleUpgrade} className="w-full">
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
