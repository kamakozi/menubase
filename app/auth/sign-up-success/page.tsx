"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, Clock, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  console.log("[v0] Sign-up success page loaded")

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
        </div>

        <Card className="glass-card animate-scale-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-serif">Welcome to MenuBase!</CardTitle>
            <CardDescription className="text-base">Your account has been created successfully</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
              <Mail className="h-5 w-5" />
              <span className="font-medium">Confirmation email sent to your inbox</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Next Steps:</h3>
              </div>
              <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the confirmation link in the email</li>
                <li>Return here and sign in to access your dashboard</li>
                <li>Start creating your digital menu</li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">🚀 Ready to get started?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Once you confirm your email, you'll have access to our powerful menu management tools.
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Link href="/auth/login">
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link href="/">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or contact support for assistance.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
