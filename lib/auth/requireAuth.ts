import { supabase } from "../supabase"

export async function requireAuth() {
  const { data } = await supabase.auth.getUser()
  return data.user
}
