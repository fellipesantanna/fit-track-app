import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // se não estiver logado, volta para login
  if (!user) {
    redirect("/auth/login")
  }

  // carregue dados protegidos aqui (server-side)
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user.email}</p>
    </div>
  )
}