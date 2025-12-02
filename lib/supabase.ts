import { createClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,   // 🔥 ESSENCIAL NO V0
        },
      }
    );
  }
  return client;
})();
