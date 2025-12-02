"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [mode, setMode] = useState<"login" | "register" | "forgot-password">("login")
  const [loading, setLoading] = useState(false)

  // Login form
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("")

  // 🔎 Verifica se já está autenticado
  useEffect(() => {
    function checkSession() {
      if (authApi.isAuthenticated()) {
        router.push("/")
      }
    }
    checkSession()
  }, [router])

  // -----------------------------------------------------
  // LOGIN
  // -----------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { success, user, error } = await authApi.login(loginEmail, loginPassword)

    if (!success) {
      toast({ title: "Erro no login", description: error, variant: "destructive" })
      setLoading(false)
      return
    }

    toast({
      title: "Bem-vindo(a)!",
      description: `Login realizado com sucesso.`,
    })

    router.refresh()
    router.push("/")
    setLoading(false)
  }

  // -----------------------------------------------------
  // REGISTRO
  // -----------------------------------------------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const result = await authApi.register(registerName, registerEmail, registerPassword)

    if (!result.success) {
      toast({
        title: "Erro no cadastro",
        description: result.error,
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    // Auto login após registrar
    await authApi.login(registerEmail, registerPassword)

    toast({
      title: "Conta criada",
      description: "Seu cadastro foi realizado com sucesso!",
    })

    router.push("/")
    setLoading(false)
  }

  // -----------------------------------------------------
  // RECUPERAÇÃO DE SENHA
  // -----------------------------------------------------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await authApi.forgotPassword(forgotEmail)

    if (!result.success) {
      toast({
        title: "Erro",
        description: result.error,
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    toast({
      title: "Email enviado",
      description: "Verifique sua caixa de entrada para redefinir sua senha.",
    })

    setMode("login")
    setLoading(false)
  }

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">FitTrack</h1>
          <p className="text-muted-foreground">
            {mode === "login" && "Entre na sua conta"}
            {mode === "register" && "Crie sua conta"}
            {mode === "forgot-password" && "Recuperar senha"}
          </p>
        </div>

        {/* -----------------------------------------------------
            LOGIN
        ------------------------------------------------------ */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                required
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                required
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-sm space-y-2">
              <button type="button" className="text-primary hover:underline" onClick={() => setMode("forgot-password")}>
                Esqueci minha senha
              </button>
              <div>
                <button type="button" className="text-primary hover:underline" onClick={() => setMode("register")}>
                  Criar conta
                </button>
              </div>
            </div>
          </form>
        )}

        {/* -----------------------------------------------------
            REGISTRO
        ------------------------------------------------------ */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input type="text" required value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" required value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                minLength={6}
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Confirmar senha</Label>
              <Input
                type="password"
                minLength={6}
                required
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>

            <div className="text-center text-sm">
              <button type="button" className="text-primary hover:underline" onClick={() => setMode("login")}>
                Já tenho conta
              </button>
            </div>
          </form>
        )}

        {/* -----------------------------------------------------
            ESQUECI A SENHA
        ------------------------------------------------------ */}
        {mode === "forgot-password" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar email de recuperação"}
            </Button>

            <div className="text-center text-sm">
              <button type="button" className="text-primary hover:underline" onClick={() => setMode("login")}>
                Voltar ao login
              </button>
            </div>
          </form>
        )}
      </Card>
    </main>
  )
}
