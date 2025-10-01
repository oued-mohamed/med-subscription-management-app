import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect to dashboard if already logged in
  if (request.nextUrl.pathname === "/login" && token) {
    const user = await verifyToken(token)
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
