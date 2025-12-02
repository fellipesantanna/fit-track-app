"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, UserPlus } from "lucide-react"
import { motion } from "framer-motion"

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function register() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    alert("Conta criada! Faça login.")
    router.push("/login")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="w-full max-w-sm rounded-xl border bg-card shadow dark:bg-card/70 p-6 flex flex-col gap-5">

        <h1 className="text-2xl font-bold text-center">Criar conta</h1>
        <p className="text-muted-foreground text-center text-sm">
          Comece a registrar seus treinos
        </p>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Crie uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            onClick={register}
            disabled={loading}
            className="w-full flex items-center gap-2 bg-purple-600 hover:bg-purple-700 py-5"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
            Criar conta
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={() => router.push("/login")}
          className="text-sm"
        >
          Já tenho uma conta →
        </Button>

      </div>
    </motion.div>
  )
}
