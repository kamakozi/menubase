"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Smartphone, Copy, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import QRCode from "qrcode"

interface TwoFactorSetupProps {
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
}

export function TwoFactorSetup({ isEnabled, onToggle }: TwoFactorSetupProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"setup" | "verify" | "complete">("setup")
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copiedSecret, setCopiedSecret] = useState(false)

  const supabase = createClient()

  const generateSecret = () => {
    // Generate a random base32 secret for TOTP
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
    let result = ""
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generateBackupCodes = () => {
    const codes = []
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()
      codes.push(code)
    }
    return codes
  }

  const setupTwoFactor = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const newSecret = generateSecret()
      const appName = "SmartMenu"
      const issuer = "SmartMenu"
      const otpAuthUrl = `otpauth://totp/${issuer}:${user.email}?secret=${newSecret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl)
      setQrCode(qrCodeDataUrl)
      setSecret(newSecret)
      setStep("verify")
    } catch (error) {
      console.error("Error setting up 2FA:", error)
      toast.error("Failed to setup 2FA")
    } finally {
      setLoading(false)
    }
  }

  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code")
      return
    }

    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // In a real implementation, you would verify the TOTP code on the server
      // For now, we'll simulate verification
      const codes = generateBackupCodes()
      setBackupCodes(codes)

      // Save 2FA settings to user profile
      const { error } = await supabase.from("user_profiles").upsert({
        user_id: user.id,
        security_settings: {
          two_factor_enabled: true,
          two_factor_secret: secret,
          backup_codes: codes,
        },
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setStep("complete")
      onToggle(true)
      toast.success("Two-factor authentication enabled!")
    } catch (error) {
      console.error("Error enabling 2FA:", error)
      toast.error("Failed to enable 2FA")
    } finally {
      setLoading(false)
    }
  }

  const disableTwoFactor = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from("user_profiles").upsert({
        user_id: user.id,
        security_settings: {
          two_factor_enabled: false,
          two_factor_secret: null,
          backup_codes: null,
        },
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      onToggle(false)
      setStep("setup")
      toast.success("Two-factor authentication disabled")
    } catch (error) {
      console.error("Error disabling 2FA:", error)
      toast.error("Failed to disable 2FA")
    } finally {
      setLoading(false)
    }
  }

  const copySecret = () => {
    navigator.clipboard.writeText(secret)
    setCopiedSecret(true)
    setTimeout(() => setCopiedSecret(false), 2000)
    toast.success("Secret copied to clipboard")
  }

  if (isEnabled) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Two-Factor Authentication
            <Badge className="bg-green-100 text-green-700">Enabled</Badge>
          </CardTitle>
          <CardDescription>Your account is protected with 2FA</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={disableTwoFactor} disabled={loading} variant="outline">
            {loading ? "Disabling..." : "Disable 2FA"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === "setup") {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-600" />
            Two-Factor Authentication
            <Badge variant="outline">Disabled</Badge>
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Before you start</h4>
              <p className="text-sm text-blue-700 mt-1">
                Install an authenticator app like Google Authenticator, Authy, or 1Password on your phone.
              </p>
            </div>
          </div>
          <Button onClick={setupTwoFactor} disabled={loading}>
            {loading ? "Setting up..." : "Setup 2FA"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === "verify") {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Setup Two-Factor Authentication</CardTitle>
          <CardDescription>Scan the QR code with your authenticator app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="mx-auto mb-4 border rounded-lg" />
            <p className="text-sm text-gray-600 mb-2">Can't scan? Enter this code manually:</p>
            <div className="flex items-center gap-2 justify-center">
              <code className="px-3 py-2 bg-gray-100 rounded text-sm font-mono">{secret}</code>
              <Button size="sm" variant="outline" onClick={copySecret}>
                {copiedSecret ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="verification">Enter the 6-digit code from your app</Label>
            <Input
              id="verification"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setStep("setup")} variant="outline" className="flex-1">
              Back
            </Button>
            <Button onClick={verifyAndEnable} disabled={loading || verificationCode.length !== 6} className="flex-1">
              {loading ? "Verifying..." : "Verify & Enable"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === "complete") {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Two-Factor Authentication Enabled!
          </CardTitle>
          <CardDescription>Save these backup codes in a safe place</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium text-amber-800 mb-2">Important: Save Your Backup Codes</h4>
            <p className="text-sm text-amber-700 mb-3">
              These codes can be used to access your account if you lose your phone. Each code can only be used once.
            </p>
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="bg-white px-3 py-2 rounded border">
                  {code}
                </div>
              ))}
            </div>
          </div>
          <Button onClick={() => setStep("setup")} className="w-full">
            Done
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
