"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Mail, Phone, Clock, HelpCircle, Book, Video, FileText } from "lucide-react"
import { toast } from "sonner"
import { useLanguage } from "@/hooks/use-language"

export default function SupportPage() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "medium",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast.success("Support ticket submitted successfully!")
      setFormData({ subject: "", category: "", priority: "medium", message: "" })
      setLoading(false)
    }, 1000)
  }

  const faqItems = [
    {
      question: "How do I change my menu template?",
      answer:
        "Go to Menu Management > Themes and select a new template. Premium templates require a subscription upgrade.",
    },
    {
      question: "Can I use my own domain?",
      answer: "Yes! Custom domains are available with Premium plans. Contact support to set up your custom domain.",
    },
    {
      question: "How do I add photos to menu items?",
      answer: "In the Visual Editor, click on any menu item and use the photo upload button to add images.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and SEPA direct debit for European customers.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
            <p className="text-gray-600">Get help with SmartMenu and manage your support tickets</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Options */}
            <div className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-violet-600" />
                    Quick Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                    <Mail className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-gray-600">support@smartmenu.at</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-gray-600">+43 1 234 5678</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-sm text-gray-600">Mon-Fri 9:00-18:00 CET</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Book className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Video className="w-4 h-4 mr-2" />
                    Video Tutorials
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Getting Started Guide
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Support Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Submit Support Ticket</CardTitle>
                  <CardDescription>Describe your issue and we'll get back to you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="billing">Billing & Payments</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="account">Account Management</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General question</SelectItem>
                          <SelectItem value="medium">Medium - Issue affecting usage</SelectItem>
                          <SelectItem value="high">High - Service disruption</SelectItem>
                          <SelectItem value="urgent">Urgent - Critical business impact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please provide detailed information about your issue..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "Submitting..." : "Submit Ticket"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-violet-600" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                      <p className="text-sm text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
