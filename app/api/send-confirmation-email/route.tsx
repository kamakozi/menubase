import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend("re_KTTkkCPM_N3cP4KPUtM6vDhq3xx1u2fBC")

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, userId } = await request.json()

    console.log("[v0] Sending confirmation email to:", email)

    const confirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://menubase.eu"}/api/test-confirm?userId=${userId}&email=${encodeURIComponent(email)}`

    const { data, error } = await resend.emails.send({
      from: "MenuBase <no-reply@mg.menubase.eu>",
      to: email,
      subject: "Confirm your MenuBase account 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Your MenuBase Account</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Confirm Your Account</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Welcome to MenuBase</p>
          </div>
          
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hello ${firstName || "there"}! 👋</h2>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #555;">
              Thank you for signing up for MenuBase! To complete your registration and start building your digital menu, please confirm your email address.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                Confirm Email Address
              </a>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">After confirmation, you'll be able to:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #555;">
                <li style="margin-bottom: 8px;">Access your MenuBase dashboard</li>
                <li style="margin-bottom: 8px;">Set up your restaurant profile</li>
                <li style="margin-bottom: 8px;">Create your first digital menu</li>
                <li>Start accepting orders online</li>
              </ul>
            </div>
            
            <p style="margin: 20px 0 0 0; font-size: 14px; color: #888;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${confirmationUrl}" style="color: #667eea; word-break: break-all;">${confirmationUrl}</a>
            </p>
            
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

    console.log("[v0] Email sent successfully:", data?.id)
    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("[v0] Error sending confirmation email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
