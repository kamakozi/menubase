import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getUser() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth")
  const isPublicRoute =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/menu/") ||
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname === "/favicon.ico"
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/")
  const isLegalRoute = ["/impressum", "/datenschutz", "/agb", "/widerruf", "/preise", "/kontakt"].includes(
    request.nextUrl.pathname,
  )
  const isSignUpFlow =
    request.nextUrl.pathname === "/auth/sign-up" ||
    request.nextUrl.pathname === "/auth/sign-up-success" ||
    request.nextUrl.pathname === "/auth/confirm-email" ||
    request.nextUrl.pathname === "/auth/email-help"

  // Debug logging for authentication issues
  if (process.env.NODE_ENV === "development") {
    console.log("[v0] Middleware - Path:", request.nextUrl.pathname)
    console.log("[v0] Middleware - User:", user ? "authenticated" : "not authenticated")
    console.log("[v0] Middleware - Is admin route:", isAdminRoute)
    console.log("[v0] Middleware - Is sign-up flow:", isSignUpFlow)
  }

  // Allow access to public routes for everyone
  if (isPublicRoute || isApiRoute || isLegalRoute) {
    console.log("[v0] Middleware - Allowing access to public/api/legal route")
    return supabaseResponse
  }

  // Allow access to auth routes for unauthenticated users
  if (isAuthRoute && !user) {
    console.log("[v0] Middleware - Allowing unauthenticated access to auth route")
    return supabaseResponse
  }

  // Redirect authenticated users away from auth routes (except logout and sign-up flow)
  if (isAuthRoute && user && !request.nextUrl.pathname.includes("logout") && !isSignUpFlow) {
    console.log("[v0] Middleware - Redirecting authenticated user to admin")
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  // Redirect unauthenticated users trying to access admin routes
  if (isAdminRoute && !user) {
    console.log("[v0] Middleware - Redirecting unauthenticated user to login")
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // For any other protected routes, redirect unauthenticated users to login
  // The middleware now only redirects for specific protected routes, not all routes

  return supabaseResponse
}
