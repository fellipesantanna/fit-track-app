"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"

import { sessionsApi } from "@/lib/sessions"
import type { WorkoutSession } from "@/lib/types"

import { DownloadIcon, TrashIcon, LogOutIcon, CheckIcon } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"

export default function ConfigPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [savingName, setSavingName] = useState(false)
  const [sessions, setSessions] = useState<WorkoutSession[]>([])

  // ---------------------------------------------------------
  // Load user + profile + sessions
  // ---------------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
          return
        }

        setUserEmail(user.email || "")

        // Load profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single()

        if (profile?.full_name) setFullName(profile.full_name)

        // Load sessions for export/delete
        const allSessions = await sessionsApi.getAll()
        setSessions(allSessions)
      } catch (err) {
        toast({
          title: "Erro ao carregar dados",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router])

  // ---------------------------------------------------------
  // Update user name
  // ---------------------------------------------------------
  const saveName = async () => {
    setSavingName(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Nome atualizado",
        description: "Seu perfil foi atualizado com sucesso.",
      })
    } catch (err) {
      toast({
        title: "Erro ao atualizar nome",
        variant: "destructive",
      })
    } finally {
      setSavingName(false)
    }
  }

  // ---------------------------------------------------------
  // Export CSV
  // ---------------------------------------------------------
  const exportCSV = () => {
    if (sessions.length === 0) {
      toast({
        title: "Sem dados para exportar",
      })
      return
    }

    let csv = "date,routine,exercise,weight,reps,duration_seconds,distance_meters,notes\n"

    sessions.forEach((session) => {
      session.exercises.forEach((ex) => {
        ex.sets.forEach((set) => {
          csv += [
            session.date,
            session.routineName || "",
            ex.exerciseId,
            set.weightKg ?? "",
            set.reps ?? "",
            set.durationSec ?? "",
            set.distanceM ?? "",
            ex.notes?.replace(/,/g, ";") ?? "",
          ].join(",") + "\n"
        })
      })
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "treinos.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "CSV exportado",
      description: "Download concluído.",
    })
  }

  // ---------------------------------------------------------
  // Delete all sessions
  // ---------------------------------------------------------
  const deleteAllSessions = async () => {
    if (!confirm("Tem certeza que quer apagar TODO o histórico?")) return

    try {
      await sessionsApi.deleteAll()
      setSessions([])

      toast({
        title: "Histórico apagado",
        description: "Todos os treinos foram removidos.",
      })
    } catch (err) {
      toast({
        title: "Erro ao apagar histórico",
        variant: "destructive",
      })
    }
  }

  // ---------------------------------------------------------
  // Logout
  // ---------------------------------------------------------
  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  if (loading) {
    return (
      <main className="p-6 text-muted-foreground">Carregando...</main>
    )
  }

  return (
    <main className="max-w-lg mx-auto p-4 pb-24 space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>

      {/* PERFIL */}
      <Card className="p-4 space-y-4">
        <h2 className="font-semibold text-lg">Seu perfil</h2>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input disabled value={userEmail} />
        </div>

        <div className="space-y-2">
          <Label>Nome</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <Button
          onClick={saveName}
          disabled={savingName}
          className="w-full gap-2"
        >
          <CheckIcon className="w-4 h-4" />
          Salvar nome
        </Button>
      </Card>

      {/* EXPORTAÇÃO */}
      <Card className="p-4 space-y-4">
        <h2 className="font-semibold text-lg">Exportar dados</h2>

        <Button
          className="w-full gap-2"
          variant="outline"
          onClick={exportCSV}
        >
          <DownloadIcon className="w-4 h-4" />
          Exportar CSV
        </Button>
      </Card>

      {/* APAGAR HISTÓRICO */}
      <Card className="p-4 space-y-4">
        <h2 className="font-semibold text-lg">Histórico</h2>

        <Button
          className="w-full gap-2 text-destructive"
          variant="ghost"
          onClick={deleteAllSessions}
        >
          <TrashIcon className="w-4 h-4" />
          Apagar tudo
        </Button>
      </Card>

      {/* LOGOUT */}
      <Card className="p-4">
        <Button
          onClick={logout}
          className="w-full gap-2"
          variant="outline"
        >
          <LogOutIcon className="w-4 h-4" />
          Sair
        </Button>
      </Card>
    </main>
  )
}
