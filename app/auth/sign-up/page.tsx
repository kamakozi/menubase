"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      console.log("[v0] Starting registration process...")

      const registrationResponse = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          businessName,
        }),
      })

      if (!registrationResponse.ok) {
        const errorData = await registrationResponse.json()
        console.error("[v0] Registration error:", errorData)
        setError(`Registration failed: ${errorData.error || "Unknown error"}`)
        setIsLoading(false)
        return
      }

      const { user } = await registrationResponse.json()
      console.log("[v0] User registration successful")

      try {
        console.log("[v0] Sending confirmation email...")
        const emailResponse = await fetch("/api/send-confirmation-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            firstName,
            lastName,
            userId: user.id,
          }),
        })

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json()
          console.error("[v0] Failed to send confirmation email:", errorData)
          // Don't block registration if email fails
        } else {
          const successData = await emailResponse.json()
          console.log("[v0] Confirmation email sent successfully:", successData)
        }
      } catch (emailError) {
        console.error("[v0] Error sending confirmation email:", emailError)
        // Don't block registration if email fails
      }

      console.log("[v0] Navigating to success page")
      setIsLoading(false)
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      console.error("[v0] Unexpected error during registration:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-foreground">
              Menu<span className="text-primary">Base</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Create your account to get started</p>
        </div>

        <Card className="glass-card animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Join MenuBase</CardTitle>
            <CardDescription className="text-base">Transform your restaurant with digital menus</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="businessName" className="text-sm font-medium">
                    Business Name
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your Restaurant Name"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="restaurant@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="repeat-password" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium hover-lift group"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </div>

              <div className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
