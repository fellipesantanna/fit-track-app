import { cookies } from "next/headers"
import { createServerClient as createSupabaseServer } from "@supabase/ssr"

export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServer(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
