import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, businessName } = await request.json()

    // Use admin client to create user without triggering confirmation emails
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("[v0] Creating user with admin API...")

    // Create user without sending confirmation email
    const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Don't auto-confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        business_name: businessName,
        email_verified: false,
      },
    })

    if (error) {
      console.error("[v0] Error creating user:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("[v0] User created successfully:", user.user?.id)

    return NextResponse.json({
      success: true,
      user: user.user,
      message: "User created successfully",
    })
  } catch (error) {
    console.error("[v0] Unexpected error in create-user API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
