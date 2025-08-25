import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

const resend = new Resend(process.env.RESEND_API_KEY)

const lastRequestTime = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[v0] RESEND_API_KEY environment variable is not set")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[v0] SUPABASE_SERVICE_ROLE_KEY environment variable is not set")
      return NextResponse.json({ error: "Database service not configured" }, { status: 500 })
    }

    const { email, resetToken, firstName } = await request.json()

    const now = Date.now()
    const lastTime = lastRequestTime.get(email) || 0
    if (now - lastTime < 5000) {
      return NextResponse.json({ error: "Please wait before requesting another reset" }, { status: 429 })
    }
    lastRequestTime.set(email, now)

    console.log("[v0] Sending password reset email to:", email)

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    })

    if (authError || !authUsers.users) {
      console.error("[v0] Error fetching users:", authError)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    const matchingUser = authUsers.users.find((user) => user.email === email)

    if (!matchingUser) {
      console.error("[v0] User not found with email:", email)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const authUser = matchingUser

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    const supabase = await createClient()
    const { error: updateError } = await supabase.from("user_profiles").upsert(
      {
        user_id: authUser.id,
        reset_token: resetToken,
        reset_token_expires: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    )

    if (updateError) {
      console.error("[v0] Error storing reset token:", updateError)
      return NextResponse.json({ error: "Failed to store reset token" }, { status: 500 })
    }

    console.log("[v0] Reset token stored successfully for user:", authUser.id)

    const resetUrl = `https://menubase.eu/auth/reset-password?token=${resetToken}`

    const { data, error } = await resend.emails.send({
      from: "MenuBase Security <no-reply@mg.menubase.eu>",
      to: email,
      subject: "Reset Your MenuBase Password 🔐",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Password Reset</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">MenuBase Security</p>
          </div>
          
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hello ${firstName || "there"}! 🔒</h2>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #555;">
              We received a request to reset your MenuBase password. If you didn't make this request, you can safely ignore this email.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>Security Notice:</strong> This reset link will expire in 1 hour for your security.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                Reset My Password
              </a>
            </div>
            
            <p style="margin: 20px 0; font-size: 14px; color: #666; text-align: center;">
              Or copy and paste this link into your browser:<br>
              <span style="word-break: break-all; color: #667eea;">${resetUrl}</span>
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="margin: 0; font-size: 14px; color: #888; text-align: center;">
              If you're having trouble, contact us at <a href="mailto:support@menubase.eu" style="color: #667eea;">support@menubase.eu</a>
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    console.log("[v0] Password reset email sent successfully:", data?.id)
    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("[v0] Error sending password reset email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
