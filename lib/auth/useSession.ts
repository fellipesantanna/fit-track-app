"use client"

import { useEffect, useState } from "react"
import { supabase } from "../supabase"

export function useSession() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      const { data } = await supabase.auth.getUser()
      if (!ignore) setUser(data.user ?? null)
      setLoading(false)
    }

    load()

    // Listener de mudanças de sessão
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!ignore) setUser(session?.user ?? null)
    })

    return () => {
      ignore = true
      listener.subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}
