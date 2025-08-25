"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, RefreshCw } from "lucide-react"

export default function ConfirmEmailPage() {
  const [user, setUser] = useState<any>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      if (user.email_confirmed_at) {
        router.push("/admin")
        return
      }

      setUser(user)
    }

    checkUser()
  }, [router])

  const handleResendConfirmation = async () => {
    if (!user?.email) return

    setIsResending(true)
    setResendMessage("")

    try {
      const response = await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      })

      if (response.ok) {
        setResendMessage("Confirmation email sent! Please check your inbox.")
      } else {
        setResendMessage("Failed to send confirmation email. Please try again.")
      }
    } catch (error) {
      setResendMessage("An error occurred. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  if (!user) {
    return null // Loading or redirecting
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif">Confirm Your Email</CardTitle>
          <CardDescription>
            Please check your email and click the confirmation link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Mail className="h-12 w-12 text-primary" />
            <div>
              <p className="font-medium">Confirmation email sent to:</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or request a new one.
            </p>

            <Button
              onClick={handleResendConfirmation}
              disabled={isResending}
              variant="outline"
              className="w-full bg-transparent"
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Confirmation Email"
              )}
            </Button>

            {resendMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  resendMessage.includes("sent")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {resendMessage}
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button onClick={() => router.push("/auth/login")} variant="ghost" className="w-full">
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
