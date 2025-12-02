import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  // Rotas públicas
  const publicRoutes = ["/login", "/register"]
  const isPublic = publicRoutes.includes(pathname)

  // Se não está logado e quer acessar rota protegida → manda para login
  if (!user && !isPublic) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Se está logado e tenta entrar em login → manda para home
  if (user && isPublic) {
    const url = req.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|public).*)",
  ],
}
