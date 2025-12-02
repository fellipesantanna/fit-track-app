import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const protectedRoutes = [
    "/",
    "/historico",
    "/historico/",
    "/historico/:path*",
    "/estatisticas",
    "/rotina",
    "/rotina/:path*",
    "/sessao",
    "/config",
  ]

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route.replace(":path*", ""))
  )

  const token = req.cookies.get("sb-access-token")

  if (isProtected && !token) {
    const url = new URL("/login", req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|login|registrar|recuperar|auth|favicon|.*\\.png).*)"],
}
