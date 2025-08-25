"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Globe, User, Bell, Shield, Camera, Mail, CreditCard, Key } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useSubscription } from "@/hooks/use-subscription"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage()
  const { subscription, planType, isTrialActive, trialDaysLeft, maxRestaurants } = useSubscription()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  // Form states
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [profilePicture, setProfilePicture] = useState("")

  // Notification preferences
  const [notifications, setNotifications] = useState({
    specialOffers: true,
    loginAlerts: true,
    securityAlerts: true,
    menuUpdates: true,
    systemUpdates: false,
  })

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginNotifications, setLoginNotifications] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)
      setEmail(user.email || "")

      // Load profile
      const { data: profileData } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

      if (profileData) {
        setProfile(profileData)
        setFirstName(profileData.first_name || "")
        setLastName(profileData.last_name || "")
        setPhoneNumber(profileData.phone_number || "")
        setProfilePicture(profileData.profile_picture_url || "")
        setNotifications(profileData.notification_preferences || notifications)
        setTwoFactorEnabled(profileData.security_settings?.two_factor_enabled || false)
        setLoginNotifications(profileData.security_settings?.login_notifications || true)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const updateProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        profile_picture_url: profilePicture,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success("Profile updated successfully")
      loadUserData()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const updateNotifications = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        user_id: user.id,
        notification_preferences: notifications,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success("Notification preferences updated")
    } catch (error) {
      console.error("Error updating notifications:", error)
      toast.error("Failed to update notifications")
    } finally {
      setLoading(false)
    }
  }

  const updateSecurity = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        user_id: user.id,
        security_settings: {
          two_factor_enabled: twoFactorEnabled,
          login_notifications: loginNotifications,
        },
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success("Security settings updated")
    } catch (error) {
      console.error("Error updating security:", error)
      toast.error("Failed to update security settings")
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = (planType: "premium" | "premium_plus") => {
    // Redirect to billing page with selected plan
    window.location.href = `/admin/billing?plan=${planType}`
  }

  const getSubscriptionStatus = () => {
    if (!subscription) return { status: "Free", color: "gray", daysLeft: null }

    if (subscription.status === "trial") {
      return {
        status: `Premium Trial (${trialDaysLeft} days left)`,
        color: trialDaysLeft > 3 ? "green" : "orange",
        daysLeft: trialDaysLeft,
      }
    }

    if (subscription.status === "active") {
      return {
        status: subscription.plan_type === "premium" ? "Premium" : "Premium Plus",
        color: "green",
        daysLeft: null,
      }
    }

    return { status: "Free", color: "gray", daysLeft: null }
  }

  const subscriptionStatus = getSubscriptionStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("settings")}</h1>
            <p className="text-gray-600">Manage your account preferences and settings</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Plan
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-violet-600" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information and profile picture</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profilePicture || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">
                        {firstName?.[0]}
                        {lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" className="mb-2 bg-transparent">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+43 123 456 7890"
                    />
                  </div>

                  <Button onClick={updateProfile} disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-violet-600" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>Manage your account information and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value={email} disabled className="bg-gray-50" />
                      <p className="text-sm text-gray-500 mt-1">Contact support to change your email address</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-violet-600" />
                      {t("language")}
                    </CardTitle>
                    <CardDescription>Choose your preferred language for the dashboard</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">{t("selectLanguage")}</label>
                        <p className="text-sm text-gray-500">
                          This will change the language for all dashboard elements
                        </p>
                      </div>
                      <Select value={language} onValueChange={(value: "en" | "de") => setLanguage(value)}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🇺🇸</span>
                              {t("english")}
                            </div>
                          </SelectItem>
                          <SelectItem value="de">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🇩🇪</span>
                              {t("german")}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-violet-600" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Special Offers</h4>
                        <p className="text-sm text-gray-500">
                          Receive notifications about promotions and special offers
                        </p>
                      </div>
                      <Switch
                        checked={notifications.specialOffers}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, specialOffers: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Login Alerts</h4>
                        <p className="text-sm text-gray-500">
                          Get notified when someone logs into your account from a new device
                        </p>
                      </div>
                      <Switch
                        checked={notifications.loginAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, loginAlerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Security Alerts</h4>
                        <p className="text-sm text-gray-500">Important security notifications and account changes</p>
                      </div>
                      <Switch
                        checked={notifications.securityAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, securityAlerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Menu Updates</h4>
                        <p className="text-sm text-gray-500">Notifications about menu changes and new items</p>
                      </div>
                      <Switch
                        checked={notifications.menuUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, menuUpdates: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">System Updates</h4>
                        <p className="text-sm text-gray-500">Platform updates and maintenance notifications</p>
                      </div>
                      <Switch
                        checked={notifications.systemUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                      />
                    </div>
                  </div>

                  <Button onClick={updateNotifications} disabled={loading}>
                    {loading ? "Updating..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-violet-600" />
                      Password & Authentication
                    </CardTitle>
                    <CardDescription>Manage your password and authentication settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={async () => {
                          if (!user?.email) return

                          try {
                            const response = await fetch("/api/send-password-reset-email", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                email: user.email,
                                resetToken: crypto.randomUUID(),
                                firstName: firstName,
                              }),
                            })

                            if (response.ok) {
                              toast.success("Password reset email sent! Check your inbox.")
                            } else {
                              throw new Error("Failed to send reset email")
                            }
                          } catch (error) {
                            console.error("Error sending reset email:", error)
                            toast.error("Failed to send reset email. Please try again.")
                          }
                        }}
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Reset Password
                      </Button>
                      <p className="text-sm text-gray-500">Send a password reset link to your email address</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Login Notifications</h4>
                        <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                      </div>
                      <Switch checked={loginNotifications} onCheckedChange={setLoginNotifications} />
                    </div>

                    <Button onClick={updateSecurity} disabled={loading}>
                      {loading ? "Updating..." : "Update Security Settings"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-violet-600" />
                    Subscription Plan
                  </CardTitle>
                  <CardDescription>Manage your subscription and billing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border">
                    <div>
                      <h3 className="font-semibold text-lg">Current Plan</h3>
                      <p className="text-gray-600">Your current subscription status</p>
                    </div>
                    <Badge
                      variant={
                        subscriptionStatus.color === "green"
                          ? "default"
                          : subscriptionStatus.color === "orange"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-lg px-4 py-2"
                    >
                      {subscriptionStatus.status}
                    </Badge>
                  </div>

                  {isTrialActive && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="font-medium text-amber-800 mb-2">Premium Trial Active</h4>
                      <p className="text-amber-700 text-sm">
                        You have {trialDaysLeft} days left in your premium trial. Upgrade to continue using premium
                        features after your trial ends.
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Free</h4>
                      <p className="text-2xl font-bold mb-2">
                        €0<span className="text-sm font-normal">/month</span>
                      </p>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Up to {maxRestaurants()} restaurants</li>
                        <li>• 2 Free templates</li>
                        <li>• Basic menu management</li>
                        <li>• Standard support</li>
                      </ul>
                    </div>

                    <div className="p-4 border-2 border-violet-500 rounded-lg bg-violet-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Premium</h4>
                        <Badge>Popular</Badge>
                      </div>
                      <p className="text-2xl font-bold mb-2">
                        €29<span className="text-sm font-normal">/month</span>
                      </p>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Up to 4 restaurants</li>
                        <li>• All templates</li>
                        <li>• Visual editor</li>
                        <li>• Custom domains</li>
                        <li>• Analytics dashboard</li>
                        <li>• Priority support</li>
                      </ul>
                      <Button
                        className="w-full mt-4"
                        disabled={planType === "premium"}
                        onClick={() => handleUpgrade("premium")}
                      >
                        {planType === "premium" ? "Current Plan" : "Upgrade"}
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Premium Plus</h4>
                      <p className="text-2xl font-bold mb-2">
                        €49<span className="text-sm font-normal">/month</span>
                      </p>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Up to 10 restaurants</li>
                        <li>• Everything in Premium</li>
                        <li>• Premium+ templates</li>
                        <li>• White-label options</li>
                        <li>• Advanced analytics</li>
                        <li>• Custom integrations</li>
                      </ul>
                      <Button
                        variant="outline"
                        className="w-full mt-4 bg-transparent"
                        disabled={planType === "premium_plus"}
                        onClick={() => handleUpgrade("premium_plus")}
                      >
                        {planType === "premium_plus" ? "Current Plan" : "Upgrade"}
                      </Button>
                    </div>
                  </div>

                  {/* Payment Implementation Section */}
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Payment Implementation</h4>
                    <p className="text-blue-700 text-sm mb-3">
                      For payment processing, we recommend integrating with Stripe for European customers:
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Stripe Checkout for subscription management</li>
                      <li>• SEPA Direct Debit for Austrian customers</li>
                      <li>• Automatic trial-to-paid conversion</li>
                      <li>• Webhook handling for subscription updates</li>
                      <li>• Invoice generation and VAT compliance</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
