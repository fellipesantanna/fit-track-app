"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { storage } from "@/lib/storage"
import { exportToCSV } from "@/lib/csv-export"
import type { Theme } from "@/lib/theme"
import { getTheme, setTheme as saveTheme } from "@/lib/theme"
import { DownloadIcon, TrashIcon, LogOutIcon, UserIcon, MoonIcon, SunIcon, MonitorIcon } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"
import { ChangePasswordDialog } from "@/components/change-password-dialog"

export default function ConfigPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null)
  const [theme, setThemeState] = useState<Theme>("system")
  const [sessionsCount, setSessionsCount] = useState(0)
  const [routinesCount, setRoutinesCount] = useState(0)
  const [exercisesCount, setExercisesCount] = useState(0)

  useEffect(() => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) {
      router.push("/auth")
      return
    }

    setUser(currentUser)
    setThemeState(getTheme())

    // Load stats
    const sessions = storage.getSessions()
    const routines = storage.getRoutines()
    const exercises = storage.getExercises()

    setSessionsCount(sessions.length)
    setRoutinesCount(routines.length)
    setExercisesCount(exercises.length)
  }, [router])

  const handleThemeChange = (newTheme: Theme) => {
    setThemeState(newTheme)
    saveTheme(newTheme)
  }

  const handleExportCSV = () => {
    const sessions = storage.getSessions()
    if (sessions.length === 0) {
      toast({
        title: "Sem dados para exportar",
        description: "Você ainda não registrou nenhum treino.",
      })
      return
    }

    exportToCSV(sessions)
    toast({
      title: "Exportação concluída",
      description: `${sessions.length} sessão(ões) exportada(s) com sucesso.`,
    })
  }

  const handleDeleteAllData = () => {
    if (!confirm("Tem certeza que deseja apagar TODOS os seus dados? Esta ação não pode ser desfeita.")) {
      return
    }

    const userId = user?.id
    if (!userId) return

    // Clear all data for current user
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const otherUsers = allUsers.filter((u: any) => u.id !== userId)

    // Keep other users' data but remove current user
    localStorage.setItem("users", JSON.stringify(otherUsers))

    // Clear current user's specific data keys
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.includes(userId)) {
        localStorage.removeItem(key)
      }
    })

    toast({
      title: "Dados apagados",
      description: "Todos os seus dados foram removidos com sucesso.",
      variant: "destructive",
    })

    // Logout after deletion
    auth.logout()
    router.push("/auth")
  }

  const handleLogout = () => {
    auth.logout()
    router.push("/auth")
  }

  if (!user) {
    return (
      <main className="p-6 text-muted-foreground">
        <p>Carregando...</p>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>

      {/* CONTA */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y">
          <div className="text-center">
            <div className="text-2xl font-bold">{sessionsCount}</div>
            <div className="text-xs text-muted-foreground">Treinos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{routinesCount}</div>
            <div className="text-xs text-muted-foreground">Rotinas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{exercisesCount}</div>
            <div className="text-xs text-muted-foreground">Exercícios</div>
          </div>
        </div>

        <ChangePasswordDialog />
      </Card>

      {/* TEMA */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-lg">Aparência</h2>
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            className="flex-col h-auto py-4 gap-2"
            onClick={() => handleThemeChange("light")}
          >
            <SunIcon className="w-5 h-5" />
            <span className="text-xs">Claro</span>
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className="flex-col h-auto py-4 gap-2"
            onClick={() => handleThemeChange("dark")}
          >
            <MoonIcon className="w-5 h-5" />
            <span className="text-xs">Escuro</span>
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            className="flex-col h-auto py-4 gap-2"
            onClick={() => handleThemeChange("system")}
          >
            <MonitorIcon className="w-5 h-5" />
            <span className="text-xs">Sistema</span>
          </Button>
        </div>
      </Card>

      {/* EXPORTAR */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-lg">Exportar dados</h2>
        <p className="text-sm text-muted-foreground">
          Baixe todos os seus treinos em formato CSV para backup ou análise.
        </p>
        <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={handleExportCSV}>
          <DownloadIcon className="w-4 h-4" />
          Exportar CSV
        </Button>
      </Card>

      {/* DADOS */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-lg text-destructive">Zona de perigo</h2>
        <p className="text-sm text-muted-foreground">
          Apague todos os seus dados permanentemente. Esta ação não pode ser desfeita.
        </p>
        <Button variant="destructive" className="w-full gap-2" onClick={handleDeleteAllData}>
          <TrashIcon className="w-4 h-4" />
          Apagar todos os dados
        </Button>
      </Card>

      {/* LOGOUT */}
      <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={handleLogout}>
        <LogOutIcon className="w-4 h-4" />
        Sair da conta
      </Button>
    </main>
  )
}
