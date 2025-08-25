import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET(request: NextRequest) {
  console.log("[v0] Test confirmation API called")

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const email = searchParams.get("email")

  console.log("[v0] Test confirmation - userId:", userId)
  console.log("[v0] Test confirmation - email:", email)

  if (!userId || !email) {
    console.log("[v0] Test confirmation - Missing parameters")
    return NextResponse.json({ error: "Missing userId or email" }, { status: 400 })
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirmed_at: new Date().toISOString(),
    })

    console.log("[v0] Test confirmation - Update result:", { data, error })

    if (error) {
      console.log("[v0] Test confirmation - Error updating user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Test confirmation - User confirmed successfully")

    // Redirect to login page
    return NextResponse.redirect(new URL("/auth/login?confirmed=true", request.url))
  } catch (error) {
    console.log("[v0] Test confirmation - Catch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
