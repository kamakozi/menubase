import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[v0] SUPABASE_SERVICE_ROLE_KEY environment variable is not set")
      return NextResponse.json({ error: "Database service not configured" }, { status: 500 })
    }

    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("user_id, reset_token_expires")
      .eq("reset_token", token)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    // Check if token is expired
    const expiresAt = new Date(profile.reset_token_expires)
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 })
    }

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

    // Update user password using admin client
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(profile.user_id, {
      password: newPassword,
    })

    if (updateError) {
      throw updateError
    }

    // Clear the reset token
    await supabase
      .from("user_profiles")
      .update({
        reset_token: null,
        reset_token_expires: null,
      })
      .eq("user_id", profile.user_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error resetting password:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
