"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Crown, Check, Star, Globe, BarChart3, Zap, SprayCan as Paypal, Building } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useSubscription } from "@/hooks/use-subscription"
import { createBrowserClient } from "@supabase/ssr"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function BillingPage() {
  const { t } = useLanguage()
  const { subscription, planType } = useSubscription()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("visa")
  const searchParams = useSearchParams()
  const preselectedPlan = searchParams.get("plan") || "premium"

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Up to 2 restaurants",
        "Classic & Minimal themes",
        "Basic menu management",
        "Mobile-friendly menus",
        "Email support",
      ],
      color: "green",
      icon: Star,
    },
    {
      id: "premium",
      name: "Premium",
      price: 29,
      period: "month",
      description: "Best for growing businesses",
      features: [
        "Up to 4 restaurants",
        "All premium themes",
        "Custom domain support (2 changes/month)",
        "Advanced analytics dashboard",
        "Photo uploads & management",
        "Discount & offers management",
        "Visual menu editor",
        "Priority support",
        "14-day free trial",
      ],
      color: "amber",
      icon: Crown,
      popular: true,
    },
    {
      id: "premium_plus",
      name: "Premium Plus",
      price: 49,
      period: "month",
      description: "For restaurant chains & enterprises",
      features: [
        "Up to 10 restaurants",
        "Everything in Premium",
        "Premium+ exclusive themes",
        "White-label options",
        "Advanced analytics & reporting",
        "Custom integrations",
        "Dedicated account manager",
        "Phone support",
        "14-day free trial",
      ],
      color: "purple",
      icon: Crown,
    },
  ]

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return

    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please log in to upgrade your plan")
        return
      }

      const plan = plans.find((p) => p.id === planId)
      if (!plan) {
        toast.error("Invalid plan selected")
        return
      }

      if (paymentMethod === "visa") {
        const response = await fetch("/api/visa/create-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: plan.price * 100, // Convert to cents
            currency: "EUR",
            planId: planId,
            userId: user.id,
            userEmail: user.email,
          }),
        })

        const { paymentUrl, error } = await response.json()

        if (error) {
          toast.error(error)
          return
        }

        if (paymentUrl) {
          window.location.href = paymentUrl
        }
      } else if (paymentMethod === "mastercard") {
        const response = await fetch("/api/mastercard/create-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: plan.price * 100, // Convert to cents
            currency: "EUR",
            planId: planId,
            userId: user.id,
            userEmail: user.email,
          }),
        })

        const { paymentUrl, error } = await response.json()

        if (error) {
          toast.error(error)
          return
        }

        if (paymentUrl) {
          window.location.href = paymentUrl
        }
      } else if (paymentMethod === "paypal") {
        // PayPal integration
        toast.info("PayPal integration coming soon!")
      }
    } catch (error) {
      console.error("Error upgrading plan:", error)
      toast.error("Failed to process upgrade. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Billing & Subscription</h1>
        <p className="text-slate-600">Manage your SmartMenu subscription and billing information</p>
      </div>

      {/* Current Plan Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 mx-auto mb-2 text-amber-500" />
            Current Plan: {planType.charAt(0).toUpperCase() + planType.slice(1).replace("_", " ")}
          </CardTitle>
          <CardDescription>
            {subscription?.trial_ends_at && new Date(subscription.trial_ends_at) > new Date() ? (
              <Badge className="bg-green-100 text-green-800">
                Trial ends in{" "}
                {Math.ceil(
                  (new Date(subscription.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                )}{" "}
                days
              </Badge>
            ) : (
              <Badge variant={planType === "free" ? "secondary" : "default"}>
                {planType === "free" ? "Free Plan" : planType === "premium" ? "Premium Plan" : "Premium Plus Plan"}
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Building className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <div className="text-2xl font-bold text-slate-800">{subscription?.restaurant_count || 0}</div>
              <div className="text-sm text-slate-600">
                Restaurants ({planType === "free" ? "2" : planType === "premium" ? "4" : "10"} max)
              </div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Globe className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <div className="text-2xl font-bold text-slate-800">{planType === "free" ? "2" : "All"}</div>
              <div className="text-sm text-slate-600">Templates Available</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <div className="text-2xl font-bold text-slate-800">{planType === "free" ? "Basic" : "Advanced"}</div>
              <div className="text-sm text-slate-600">Analytics</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {planType === "free" ? "Upgrade Your Plan" : "Available Plans"}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = plan.id === planType
            return (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "ring-2 ring-amber-500 shadow-lg" : ""} ${isCurrentPlan ? "bg-green-50 border-green-200" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-amber-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-500 text-white px-3 py-1">Current</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Icon className={`w-12 h-12 text-${plan.color}-500`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-slate-800">
                    €{plan.price}
                    {plan.price > 0 && <span className="text-lg font-normal text-slate-600">/{plan.period}</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.id !== "free" && !isCurrentPlan && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold">Payment Method</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visa">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-blue-600" />
                                Visa Direct
                              </div>
                            </SelectItem>
                            <SelectItem value="mastercard">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-red-600" />
                                Mastercard Direct
                              </div>
                            </SelectItem>
                            <SelectItem value="paypal">
                              <div className="flex items-center gap-2">
                                <Paypal className="w-4 h-4" />
                                PayPal (Coming Soon)
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={loading || paymentMethod === "paypal"}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      >
                        {loading ? "Processing..." : `Start ${plan.name} Plan`}
                      </Button>
                      <p className="text-xs text-center text-slate-500">
                        14-day free trial • Cancel anytime • No setup fees
                      </p>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <Button disabled className="w-full bg-green-100 text-green-800">
                      Current Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Accepted Payment Methods</CardTitle>
          <CardDescription>
            We support multiple secure payment options for Austrian and European customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center p-4 border rounded-lg bg-blue-50 border-blue-200">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="ml-2 font-semibold text-blue-800">Visa Direct</span>
            </div>
            <div className="flex items-center justify-center p-4 border rounded-lg bg-red-50 border-red-200">
              <CreditCard className="w-8 h-8 text-red-600" />
              <span className="ml-2 font-semibold text-red-800">Mastercard</span>
            </div>
            <div className="flex items-center justify-center p-4 border rounded-lg opacity-50">
              <Paypal className="w-8 h-8 text-blue-600" />
              <span className="ml-2 font-semibold">PayPal</span>
            </div>
            <div className="flex items-center justify-center p-4 border rounded-lg">
              <Zap className="w-8 h-8 text-purple-600" />
              <span className="ml-2 font-semibold">SEPA</span>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Secure Payment Processing</h4>
            <p className="text-sm text-blue-700">
              All payments are processed securely with SSL encryption. We support Visa Direct and Mastercard payments
              for Austrian customers. All transactions comply with European VAT regulations and PCI DSS standards.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
