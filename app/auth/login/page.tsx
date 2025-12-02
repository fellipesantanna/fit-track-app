"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabase" // usa o mesmo client que você já está usando
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, LogIn } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) {
      alert("Preencha e-mail e senha.")
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      console.error("Erro no login Supabase:", error)

      // mostra a mensagem real do Supabase (email não confirmado, senha errada etc.)
      alert(error.message || "Erro ao fazer login. Verifique os dados.")
      return
    }

    console.log("Login OK:", data)
    router.push("/")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="w-full max-w-sm rounded-xl border bg-card dark:bg-card/70 shadow p-6 flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-center">Entrar</h1>
        <p className="text-muted-foreground text-center text-sm">
          Acesse sua conta de treino
        </p>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center gap-2 bg-purple-600 hover:bg-purple-700 py-5"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            Entrar
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={() => router.push("/auth/register")}
          className="text-sm"
        >
          Criar nova conta →
        </Button>
      </div>
    </motion.div>
  )
}
