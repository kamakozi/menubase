import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  console.log("[v0] Confirm-email API called with URL:", request.url)

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const email = searchParams.get("email")

    console.log("[v0] Extracted parameters - userId:", userId, "email:", email)

    if (!userId || !email) {
      console.log("[v0] Missing parameters - userId:", userId, "email:", email)
      return NextResponse.redirect(new URL("/auth/confirm-email?error=missing-parameters", request.url))
    }

    console.log("[v0] Confirming email for user:", userId, "email:", email)

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("[v0] Getting user by ID with admin client...")
    const { data: user, error: getUserError } = await supabase.auth.admin.getUserById(userId)

    if (getUserError || !user) {
      console.error("[v0] User not found:", getUserError)
      return NextResponse.redirect(new URL("/auth/confirm-email?error=user-not-found", request.url))
    }

    const decodedEmail = decodeURIComponent(email)
    console.log("[v0] Email comparison - user email:", user.user.email, "provided email:", decodedEmail)

    if (user.user.email !== decodedEmail) {
      console.error("[v0] Email mismatch - expected:", user.user.email, "got:", decodedEmail)
      return NextResponse.redirect(new URL("/auth/confirm-email?error=email-mismatch", request.url))
    }

    console.log("[v0] Updating user email confirmation status...")
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      email_confirmed_at: new Date().toISOString(),
    })

    if (updateError) {
      console.error("[v0] Failed to confirm email:", updateError)
      return NextResponse.redirect(new URL("/auth/confirm-email?error=confirmation-failed", request.url))
    }

    console.log("[v0] Email confirmed successfully for user:", userId)
    return NextResponse.redirect(new URL("/auth/login?confirmed=true", request.url))
  } catch (error) {
    console.error("[v0] Error confirming email:", error)
    return NextResponse.redirect(new URL("/auth/confirm-email?error=server-error", request.url))
  }
}
