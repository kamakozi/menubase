import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[v0] RESEND_API_KEY environment variable is not set")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const { email, firstName, confirmationUrl } = await request.json()

    console.log("[v0] Email API - Sending email to:", email)
    console.log("[v0] Email API - Confirmation URL:", confirmationUrl)

    const { data, error } = await resend.emails.send({
      from: "MenuBase <no-reply@mg.menubase.eu>",
      to: email,
      subject: "Confirm your MenuBase account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; font-size: 28px; margin: 0;">MenuBase</h1>
            <p style="color: #6b7280; font-size: 16px; margin: 10px 0 0 0;">Digital Menu Platform</p>
          </div>
          
          <div style="background: #f8fafc; border-radius: 12px; padding: 30px; margin: 20px 0;">
            <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Welcome to MenuBase, ${firstName}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              Thank you for creating your MenuBase account. To get started with creating your digital restaurant menu, please confirm your email address by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" 
                 style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                Confirm Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 25px 0 0 0;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${confirmationUrl}" style="color: #2563eb; word-break: break-all;">${confirmationUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              This email was sent to ${email}. If you didn't create a MenuBase account, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("[v0] Email API - Resend error:", error)
      return NextResponse.json({ error: "Failed to send email", details: error }, { status: 500 })
    }

    console.log("[v0] Email API - Email sent successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Email API - Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
