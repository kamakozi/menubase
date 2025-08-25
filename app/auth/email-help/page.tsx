import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Mail, Settings, Shield } from "lucide-react"
import Link from "next/link"

export default function EmailHelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Smart<span className="text-amber-600">Menu</span>
          </h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <Mail className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">Email Confirmation Help</CardTitle>
            <CardDescription>Troubleshooting email delivery issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Known Issue</h3>
                  <p className="text-sm text-red-700">
                    We're currently experiencing email delivery issues due to Supabase's built-in email provider
                    limitations. We're working on implementing a custom SMTP solution to resolve this.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Immediate Solutions
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check your spam/junk folder thoroughly</li>
                  <li>• Wait up to 15 minutes for email delivery</li>
                  <li>• Try using a different email provider (Gmail, Outlook, etc.)</li>
                  <li>• Contact support for manual account verification</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  What We're Doing
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Setting up custom SMTP with reliable email provider</li>
                  <li>• Implementing proper email authentication (DKIM, SPF, DMARC)</li>
                  <li>• Adding email delivery monitoring and retry logic</li>
                  <li>• Creating fallback verification methods</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild className="flex-1 bg-amber-600 hover:bg-amber-700">
                <Link href="/auth/sign-up">Try Again</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              For immediate assistance, contact support at{" "}
              <a href="mailto:support@smartmenu.app" className="text-amber-600 hover:text-amber-700 underline">
                support@smartmenu.app
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
