"use client"

import { supabase } from "@/lib/supabase"
import { useState } from "react"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: any) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)

    if (error) return setError(error.message)

    window.location.href = "/dashboard"
  }

  async function handleSignup(e: any) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    setLoading(false)

    if (error) return setError(error.message)
    alert("Conta criada — verifique seu email")
  }

  return (
    <div style={{ maxWidth: 360, margin: "60px auto" }}>
      <h1>Entrar</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          Entrar
        </button>
      </form>

      <hr />
      <button onClick={handleSignup} disabled={loading}>
        Criar conta
      </button>
    </div>
  )
}
