// app/middleware.ts
import { NextResponse } from "next/server"
import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const isAuthPage = req.nextUrl.pathname.startsWith("/auth")

  // Usuário não logado → envia para /auth
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth", req.url))
  }

  // Usuário logado indo pra /auth → redirecionar ao dashboard
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/exercicios/:path*",
    "/rotinas/:path*",
    "/sessao/:path*",
    "/historico/:path*",
    "/auth",
  ],
}
