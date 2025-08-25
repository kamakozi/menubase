"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ExternalLink, Mail, DollarSign, Zap, Shield } from "lucide-react"

export default function EmailSetupPage() {
  const [selectedProvider, setSelectedProvider] = useState("resend")

  const providers = [
    {
      id: "resend",
      name: "Resend",
      description: "Modern email API built for developers",
      pricing: "Free: 3,000 emails/month • Pro: $20/month for 50,000 emails",
      features: ["Easy setup", "Great deliverability", "Developer-friendly", "EU compliance"],
      recommended: true,
      setup: {
        signup: "https://resend.com",
        steps: [
          "Sign up at resend.com",
          "Verify your domain (or use resend.dev for testing)",
          "Get your API key from the dashboard",
          "Configure SMTP settings in Supabase",
        ],
        smtp: {
          host: "smtp.resend.com",
          port: "587",
          user: "resend",
          note: "Use your Resend API key as the password",
        },
      },
    },
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "Twilio SendGrid email delivery platform",
      pricing: "Free: 100 emails/day • Essentials: $19.95/month for 50,000 emails",
      features: ["Reliable delivery", "Analytics", "Template engine", "Global infrastructure"],
      recommended: false,
      setup: {
        signup: "https://sendgrid.com",
        steps: [
          "Sign up at sendgrid.com",
          "Complete sender authentication",
          "Create an API key with Mail Send permissions",
          "Configure SMTP settings in Supabase",
        ],
        smtp: {
          host: "smtp.sendgrid.net",
          port: "587",
          user: "apikey",
          note: "Use your SendGrid API key as the password",
        },
      },
    },
    {
      id: "postmark",
      name: "Postmark",
      description: "Fast and reliable transactional email service",
      pricing: "Free: 100 emails/month • Starter: $15/month for 10,000 emails",
      features: ["Fast delivery", "Detailed analytics", "Bounce handling", "Template system"],
      recommended: false,
      setup: {
        signup: "https://postmarkapp.com",
        steps: [
          "Sign up at postmarkapp.com",
          "Add and verify your domain",
          "Create a server and get the API token",
          "Configure SMTP settings in Supabase",
        ],
        smtp: {
          host: "smtp.postmarkapp.com",
          port: "587",
          user: "Your Server API Token",
          note: "Use the same API token for both username and password",
        },
      },
    },
  ]

  const selectedProviderData = providers.find((p) => p.id === selectedProvider)

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Provider Setup</h1>
        <p className="text-muted-foreground">
          Configure a reliable email provider for your SmartMenu authentication emails
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {providers.map((provider) => (
          <Card
            key={provider.id}
            className={`cursor-pointer transition-all ${
              selectedProvider === provider.id ? "ring-2 ring-primary" : ""
            } ${provider.recommended ? "border-green-200 bg-green-50/50" : ""}`}
            onClick={() => setSelectedProvider(provider.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {provider.name}
                </CardTitle>
                {provider.recommended && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Recommended
                  </Badge>
                )}
              </div>
              <CardDescription>{provider.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{provider.pricing}</span>
                </div>
                <div className="space-y-1">
                  {provider.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProviderData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Setup Guide: {selectedProviderData.name}
            </CardTitle>
            <CardDescription>
              Follow these steps to configure {selectedProviderData.name} with your Supabase project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signup">1. Sign Up</TabsTrigger>
                <TabsTrigger value="configure">2. Configure</TabsTrigger>
                <TabsTrigger value="supabase">3. Supabase Setup</TabsTrigger>
              </TabsList>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Create Your Account</h3>
                  <ol className="space-y-3">
                    {selectedProviderData.setup.steps.slice(0, 2).map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  <Button asChild className="w-full">
                    <a href={selectedProviderData.setup.signup} target="_blank" rel="noopener noreferrer">
                      Sign Up for {selectedProviderData.name}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="configure" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Get Your SMTP Credentials</h3>
                  <ol className="space-y-3">
                    {selectedProviderData.setup.steps.slice(2).map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 3}
                        </div>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>

                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base">SMTP Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Host:</span>
                          <code className="ml-2 bg-background px-2 py-1 rounded">
                            {selectedProviderData.setup.smtp.host}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium">Port:</span>
                          <code className="ml-2 bg-background px-2 py-1 rounded">
                            {selectedProviderData.setup.smtp.port}
                          </code>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Username:</span>
                          <code className="ml-2 bg-background px-2 py-1 rounded">
                            {selectedProviderData.setup.smtp.user}
                          </code>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Password:</span>
                          <span className="ml-2 text-muted-foreground">{selectedProviderData.setup.smtp.note}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="supabase" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configure Supabase</h3>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <span>Go to your Supabase Dashboard → Authentication → Settings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <span>Scroll down to "SMTP Settings" and click "Enable custom SMTP"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <span>Enter the SMTP settings from step 2</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        4
                      </div>
                      <span>Set your "From" email address (e.g., noreply@yourdomain.com)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        5
                      </div>
                      <span>Save the settings and test by registering a new user</span>
                    </li>
                  </ol>

                  <Card className="border-green-200 bg-green-50/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>• Make sure to verify your domain with your email provider for better deliverability</p>
                      <p>• Test the setup with a real email address before going live</p>
                      <p>• Monitor your email provider's dashboard for delivery statistics</p>
                      <p>• Consider setting up DKIM and SPF records for your domain</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
