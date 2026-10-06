import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Platform routes ──────────────────────────────────────────────────────
  if (pathname.startsWith("/platform")) {
    // Login page is always public
    if (pathname === "/platform/login") return NextResponse.next()

    const token = request.cookies.get("opsaura-platform-auth")?.value
    if (!token) {
      return NextResponse.redirect(new URL("/platform/login", request.url))
    }
    return NextResponse.next()
  }

  // ── Tenant routes ────────────────────────────────────────────────────────
  if (pathname === "/login" || pathname.startsWith("/reset-password")) {
    return NextResponse.next()
  }

  const token = request.cookies.get("opsaura-auth")?.value
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}
