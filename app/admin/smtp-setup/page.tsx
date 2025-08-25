import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Settings, CheckCircle, ExternalLink } from "lucide-react"

export default function SMTPSetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Mail className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configure Supabase Email with Resend</h1>
          <p className="text-gray-600">Set up reliable email delivery for your SmartMenu app</p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Get Resend SMTP Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  1
                </Badge>
                Get Resend SMTP Settings
              </CardTitle>
              <CardDescription>First, get your SMTP credentials from Resend</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Resend SMTP Settings:</h4>
                <div className="space-y-2 font-mono text-sm">
                  <div>
                    <strong>Host:</strong> smtp.resend.com
                  </div>
                  <div>
                    <strong>Port:</strong> 587 (or 465 for SSL)
                  </div>
                  <div>
                    <strong>Username:</strong> resend
                  </div>
                  <div>
                    <strong>Password:</strong> Your Resend API Key (re_RjixEigj_4uQjrCQRTTZczeuTEJ6QqF55)
                  </div>
                  <div>
                    <strong>From Email:</strong> onboarding@resend.dev (or your verified domain)
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> You can use your existing Resend API key as the SMTP password
              </p>
            </CardContent>
          </Card>

          {/* Step 2: Configure Supabase */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  2
                </Badge>
                Configure Supabase Dashboard
              </CardTitle>
              <CardDescription>Set up custom SMTP in your Supabase project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Go to Supabase Dashboard</p>
                    <p className="text-sm text-gray-600">Navigate to your project at supabase.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Open Authentication Settings</p>
                    <p className="text-sm text-gray-600">Go to Authentication → Settings in the sidebar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Enable Custom SMTP</p>
                    <p className="text-sm text-gray-600">Scroll down to "SMTP Settings" and enable custom SMTP</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Enter Resend SMTP Details</p>
                    <p className="text-sm text-gray-600">Fill in the SMTP settings from Step 1</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Test Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  3
                </Badge>
                Test Email Delivery
              </CardTitle>
              <CardDescription>Verify that emails are working correctly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-800">Test Registration:</h4>
                <p className="text-sm text-green-700">
                  Try registering a new account to test if confirmation emails are delivered through Resend
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ExternalLink className="w-4 h-4" />
                <span>You can monitor email delivery in your Resend dashboard</span>
              </div>
            </CardContent>
          </Card>

          {/* Alternative: Email Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Optional: Customize Email Templates
              </CardTitle>
              <CardDescription>Make your emails look professional</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                In Supabase Authentication → Email Templates, you can customize:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Confirm signup email template</li>
                <li>• Password reset email template</li>
                <li>• Email change confirmation template</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg border-2 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">🎉 Once configured:</h3>
          <p className="text-blue-800">
            Your SmartMenu app will send reliable confirmation emails through Resend, and users will receive
            professional-looking emails for account verification, password resets, and other authentication flows.
          </p>
        </div>
      </div>
    </div>
  )
}
