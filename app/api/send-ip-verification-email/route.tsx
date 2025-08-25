import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[v0] RESEND_API_KEY environment variable is not set")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const { email, verificationCode, firstName, ipAddress, location, device } = await request.json()

    console.log("[v0] Sending IP verification email to:", email)

    const { data, error } = await resend.emails.send({
      from: "MenuBase Security <no-reply@mg.menubase.eu>",
      to: email,
      subject: "New Login from Different Location 🌍",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Verification Required</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ffa726 0%, #ff7043 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Login Verification</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">MenuBase Security Alert</p>
          </div>
          
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hello ${firstName || "there"}! 🔐</h2>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #555;">
              We detected a login attempt to your MenuBase account from a new location. If this was you, please verify your identity using the code below.
            </p>
            
            <div style="background: #e3f2fd; border: 1px solid #90caf9; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1565c0; font-size: 16px;">Login Details:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #1565c0; font-size: 14px;">
                <li><strong>IP Address:</strong> ${ipAddress || "Unknown"}</li>
                <li><strong>Location:</strong> ${location || "Unknown"}</li>
                <li><strong>Device:</strong> ${device || "Unknown"}</li>
                <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0; background: #f8f9fa; padding: 25px; border-radius: 8px;">
              <h3 style="margin: 0 0 15px 0; color: #333;">Your Verification Code:</h3>
              <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace;">
                ${verificationCode}
              </div>
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">
                This code expires in 10 minutes
              </p>
            </div>
            
            <div style="background: #ffebee; border: 1px solid #ffcdd2; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0; color: #c62828; font-size: 14px;">
                <strong>Wasn't you?</strong> If you didn't attempt to log in, please secure your account immediately by changing your password.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="margin: 0; font-size: 14px; color: #888; text-align: center;">
              Need help? Contact us at <a href="mailto:support@menubase.eu" style="color: #667eea;">support@menubase.eu</a>
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

    console.log("[v0] IP verification email sent successfully:", data?.id)
    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("[v0] Error sending IP verification email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
