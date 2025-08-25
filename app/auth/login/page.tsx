"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedEmail = localStorage.getItem("smartmenu_email")
    const savedPassword = localStorage.getItem("smartmenu_password")
    const savedRemember = localStorage.getItem("smartmenu_remember") === "true"

    if (savedRemember && savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      if (rememberMe) {
        localStorage.setItem("smartmenu_email", email)
        localStorage.setItem("smartmenu_password", password)
        localStorage.setItem("smartmenu_remember", "true")
      } else {
        localStorage.removeItem("smartmenu_email")
        localStorage.removeItem("smartmenu_password")
        localStorage.removeItem("smartmenu_remember")
      }

      router.push("/admin")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-foreground">
              Menu<span className="text-primary">Base</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Sign in to manage your restaurant menus</p>
        </div>

        <Card className="glass-card animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
            <CardDescription className="text-base">Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
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

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember my login credentials
                  </Label>
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
                  {isLoading ? "Signing in..." : "Sign In"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm">
                Don't have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors"
                >
                  Create account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
