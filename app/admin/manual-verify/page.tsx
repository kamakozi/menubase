"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ManualVerifyPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const { error } = await supabase.rpc("manually_verify_user", {
        user_email: email,
      })

      if (error) {
        console.error("Manual verification error:", error)
        toast.error("Failed to verify user: " + error.message)
      } else {
        toast.success("User verified successfully! They can now log in.")
        setEmail("")
      }
    } catch (error) {
      console.error("Manual verification error:", error)
      toast.error("Failed to verify user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto pt-20">
        <Card>
          <CardHeader>
            <CardTitle>Manual User Verification</CardTitle>
            <CardDescription>
              Temporarily verify users for testing while email delivery is being configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualVerify} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter user email to verify"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Verifying..." : "Verify User"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="font-medium text-amber-800 mb-2">Email Delivery Issue</h3>
              <p className="text-sm text-amber-700">
                Supabase's built-in email provider has low rate limits and poor deliverability. To fix this permanently,
                configure a custom SMTP provider in your Supabase project settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
