"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { createClient } from "@/lib/supabase/client"
import { usePathname } from "next/navigation"

interface SubscriptionContextType {
  subscription: any
  loading: boolean
  canUseTemplate: (template: string) => boolean
  canCreateRestaurants: (currentCount: number) => boolean
  hasCustomDomain: () => boolean
  hasAnalytics: () => boolean
  maxRestaurants: () => number
  planType: string
  isTrialActive: boolean
  trialDaysLeft: number
  refreshSubscription: () => void
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const supabase = createClient()

  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/menu/") ||
    pathname.startsWith("/auth/") ||
    ["/impressum", "/datenschutz", "/agb", "/widerruf", "/preise", "/kontakt"].includes(pathname)

  const loadSubscription = async () => {
    try {
      if (isPublicPage) {
        setLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      setSubscription(data)
    } catch (error) {
      console.error("Error loading subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubscription()
  }, [pathname])

  const getPlanType = () => {
    if (!subscription) return "free"
    if (subscription.status === "trial") return "premium" // Trial gives premium features
    if (subscription.status === "active") return subscription.plan_type
    return "free"
  }

  const isTrialActive = () => {
    if (!subscription || subscription.status !== "trial") return false
    return new Date(subscription.trial_end_date) > new Date()
  }

  const getTrialDaysLeft = () => {
    if (!isTrialActive()) return 0
    return Math.ceil((new Date(subscription.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }

  const canUseTemplate = (template: string) => {
    const planType = getPlanType()
    const freeTemplates = ["classic", "minimal"]
    const premiumTemplates = ["modern", "elegant", "rustic"]
    const premiumPlusTemplates = ["modern-glass", "vintage"]

    if (freeTemplates.includes(template)) return true
    if (premiumTemplates.includes(template)) return planType === "premium" || planType === "premium_plus"
    if (premiumPlusTemplates.includes(template)) return planType === "premium_plus"
    return false
  }

  const canCreateRestaurants = (currentCount: number) => {
    const planType = getPlanType()
    const maxRestaurants = getMaxRestaurants()
    return currentCount < maxRestaurants
  }

  const getMaxRestaurants = () => {
    const planType = getPlanType()
    switch (planType) {
      case "free":
        return 2
      case "premium":
        return 4
      case "premium_plus":
        return 10
      default:
        return 2
    }
  }

  const hasCustomDomain = () => {
    const planType = getPlanType()
    return planType === "premium" || planType === "premium_plus"
  }

  const hasAnalytics = () => {
    const planType = getPlanType()
    return planType === "premium" || planType === "premium_plus"
  }

  const value = {
    subscription,
    loading,
    canUseTemplate,
    canCreateRestaurants,
    hasCustomDomain,
    hasAnalytics,
    maxRestaurants: getMaxRestaurants,
    planType: getPlanType(),
    isTrialActive: isTrialActive(),
    trialDaysLeft: getTrialDaysLeft(),
    refreshSubscription: loadSubscription,
  }

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
