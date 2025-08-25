"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const [checkingToken, setCheckingToken] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const checkResetToken = async () => {
      const token = searchParams.get("token")

      if (!token) {
        console.log("[v0] No reset token found in URL")
        setCheckingToken(false)
        return
      }

      console.log("[v0] Found reset token, validating...")

      try {
        const response = await fetch("/api/validate-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        if (response.ok) {
          setValidToken(true)
        } else {
          setValidToken(false)
        }
      } catch (error) {
        console.error("[v0] Error validating token:", error)
        setValidToken(false)
      }

      setCheckingToken(false)
    }

    checkResetToken()
  }, [searchParams])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      console.log("[v0] Updating password with token...")

      const token = searchParams.get("token")

      const response = await fetch("/api/reset-password-with-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to reset password")
      }

      console.log("[v0] Password updated successfully")
      toast.success("Password updated successfully! You can now log in with your new password.")
      router.push("/auth/login")
    } catch (error: any) {
      console.error("[v0] Error updating password:", error)
      toast.error(error.message || "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Validating reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">Invalid Reset Link</CardTitle>
            <CardDescription>This password reset link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-violet-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 6 characters long</li>
                <li>Must match confirmation password</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating Password..." : "Update Password"}
            </Button>

            <Link href="/auth/login">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
