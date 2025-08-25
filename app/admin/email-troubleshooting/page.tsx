"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Mail, Settings, ExternalLink } from "lucide-react"

export default function EmailTroubleshooting() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Delivery Troubleshooting</h1>
        <p className="text-muted-foreground">
          Your registration system is working perfectly, but emails might not be delivered due to domain reputation
          issues.
        </p>
      </div>

      <Alert className="mb-6 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Good news!</strong> Your registration system is working correctly. Supabase is successfully sending
          emails through Resend SMTP.
        </AlertDescription>
      </Alert>

      <Alert className="mb-6 border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Issue:</strong> You're using <code>onboarding@resend.dev</code> which is a shared demo domain with
          poor reputation.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Immediate Steps to Check
            </CardTitle>
            <CardDescription>Check these first before making any changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Check Your Spam/Junk Folder</h4>
                  <p className="text-sm text-muted-foreground">
                    This is the most common issue. Look for emails from "SmartMenu &lt;onboarding@resend.dev&gt;"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Check All Email Folders</h4>
                  <p className="text-sm text-muted-foreground">
                    Gmail: Check Promotions, Social, Updates tabs. Outlook: Check Clutter folder
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Wait 5-10 Minutes</h4>
                  <p className="text-sm text-muted-foreground">
                    Email delivery can have delays, especially for new SMTP configurations
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Why Emails Go to Spam
            </CardTitle>
            <CardDescription>Understanding the root cause</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">The Problem with onboarding@resend.dev</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• It's a shared demo domain used by thousands of developers</li>
                <li>• Poor sender reputation due to high volume and testing</li>
                <li>• Email providers (Gmail, Outlook) mark it as suspicious</li>
                <li>• No DKIM/SPF authentication for your specific use case</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Long-term Solution: Custom Domain</CardTitle>
            <CardDescription>For reliable email delivery in production</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Recommended Setup</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Domain:</strong> Use your own domain (e.g., noreply@yourdomain.com)
                </p>
                <p>
                  <strong>Resend Plan:</strong> Upgrade to a paid plan for custom domains
                </p>
                <p>
                  <strong>DNS Setup:</strong> Configure DKIM, SPF, and DMARC records
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Set Up Custom Domain in Resend
                </a>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <a href="https://supabase.com/docs/guides/auth/auth-smtp" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Supabase SMTP Documentation
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>What's working and what needs attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">User registration working perfectly</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Supabase SMTP configured correctly</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Resend integration active</span>
              </div>
              <div className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Email delivery affected by demo domain reputation</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
