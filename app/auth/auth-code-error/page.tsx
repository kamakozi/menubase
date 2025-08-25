import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl font-serif">Email Confirmation Failed</CardTitle>
            <CardDescription>
              There was an issue confirming your email address. The link may have expired or been used already.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Please try signing up again or contact support if the problem persists.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/auth/sign-up">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Try Again
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/auth/login">Sign In Instead</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
