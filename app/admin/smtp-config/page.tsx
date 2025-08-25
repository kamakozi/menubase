"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Mail, Settings, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function SMTPConfigPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const smtpSettings = {
    host: "smtp.resend.com",
    port: "587",
    user: "resend",
    password: "re_RjixEigj_4uQjrCQRTTZczeuTEJ6QqF55",
    from: "onboarding@resend.dev",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">SMTP Configuration Guide</h1>
          <p className="text-gray-600">Configure Supabase to use Resend for reliable email delivery</p>
        </div>

        {/* Step 1: Access Supabase Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">Step 1</Badge>
              <ExternalLink className="h-5 w-5" />
              Access Your Supabase Dashboard
            </CardTitle>
            <CardDescription>Navigate to your Supabase project settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">Your Supabase Project URL:</p>
              <div className="flex items-center gap-2">
                <code className="bg-white px-3 py-2 rounded border flex-1">
                  https://ynntsixovotyumiybwnk.supabase.co
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("https://ynntsixovotyumiybwnk.supabase.co", "url")}
                >
                  {copiedField === "url" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to your Supabase dashboard</li>
              <li>
                Select your project: <strong>ynntsixovotyumiybwnk</strong>
              </li>
              <li>
                Navigate to <strong>Authentication</strong> in the left sidebar
              </li>
              <li>
                Click on <strong>Settings</strong> tab
              </li>
              <li>
                Scroll down to find <strong>SMTP Settings</strong>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Step 2: Configure SMTP Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">Step 2</Badge>
              <Settings className="h-5 w-5" />
              Configure SMTP Settings
            </CardTitle>
            <CardDescription>Enter these exact values in your Supabase SMTP configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {Object.entries(smtpSettings).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium capitalize">
                    {key === "from" ? "From Email Address" : `SMTP ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-3 py-2 rounded border flex-1 font-mono text-sm">{value}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(value, key)}>
                      {copiedField === key ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • Make sure to enable <strong>"Enable custom SMTP"</strong> checkbox
                </li>
                <li>
                  • Use <strong>TLS</strong> encryption (usually selected by default)
                </li>
                <li>• The password is your Resend API key</li>
                <li>• Save the settings after entering all values</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Test Email Delivery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">Step 3</Badge>
              <Mail className="h-5 w-5" />
              Test Email Delivery
            </CardTitle>
            <CardDescription>Verify that emails are working correctly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>After saving SMTP settings, go back to your SmartMenu app</li>
              <li>Try registering a new account with a different email</li>
              <li>You should receive the confirmation email within 1-2 minutes</li>
              <li>Check your spam folder if you don't see it in your inbox</li>
            </ol>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Success Indicators:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Email arrives quickly (within 1-2 minutes)</li>
                <li>• Email comes from "onboarding@resend.dev"</li>
                <li>• Confirmation link works properly</li>
                <li>• No more "confirmation_sent_at" without actual delivery</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Troubleshooting</CardTitle>
            <CardDescription>Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">Still not receiving emails?</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Double-check all SMTP settings are entered correctly</li>
                <li>• Ensure "Enable custom SMTP" is checked</li>
                <li>• Verify your Resend API key is active</li>
                <li>• Check Resend dashboard for delivery logs</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Authentication errors?</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Make sure the password field contains your full Resend API key</li>
                <li>• Username should be exactly "resend" (lowercase)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
