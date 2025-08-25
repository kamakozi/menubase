import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("reset_token, reset_token_expires")
      .eq("reset_token", token)
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    // Check if token is expired (1 hour expiry)
    const expiresAt = new Date(profile.reset_token_expires)
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error("[v0] Error validating reset token:", error)
    return NextResponse.json({ error: "Failed to validate token" }, { status: 500 })
  }
}
