"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, DumbbellIcon, TrashIcon, ChevronRightIcon } from "@/components/icons"

import { sessionsApi } from "@/lib/sessions"
import { exercisesApi } from "@/lib/exercises"

import type { WorkoutSession, Exercise } from "@/lib/types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { useToast } from "@/hooks/use-toast"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function HistoricoPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null)

  // --------------------------
  // LOAD SESSIONS + EXERCISES
  // --------------------------
  const loadData = async () => {
    try {
      setLoading(true)

      const [dbSessions, allExercises] = await Promise.all([sessionsApi.getAll(), exercisesApi.getAll()])

      setSessions(dbSessions)
      setExercises(allExercises)
    } catch (err) {
      console.error(err)
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar suas sessões",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // --------------------------
  // DELETE SESSION
  // --------------------------
  const handleDelete = async (sessionId: string) => {
    try {
      await sessionsApi.delete(sessionId)
      await loadData()
      setDeleteSessionId(null)

      toast({
        title: "Sessão excluída",
        description: "A sessão foi removida do histórico",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Erro ao excluir sessão",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      })
    }
  }

  // --------------------------
  // HELPERS
  // --------------------------
  const getExerciseName = (exerciseId: string) => {
    return exercises.find((e) => e.id === exerciseId)?.name || "Exercício"
  }

  const getExerciseCategory = (exerciseId: string) => {
    return exercises.find((e) => e.id === exerciseId)?.category
  }

  const getTotalSets = (session: WorkoutSession) => {
    return session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
  }

  // --------------------------
  // RENDER
  // --------------------------
  return (
    <main className="max-w-lg mx-auto p-4 pb-24 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Histórico</h1>
        <p className="text-muted-foreground">
          {loading
            ? "Carregando sessões..."
            : sessions.length === 0
              ? "Nenhuma sessão registrada"
              : `${sessions.length} registro(s)`}
        </p>
      </div>

      {/* LISTA */}
      <div className="space-y-3">
        {!loading &&
          sessions.map((session) => (
            <Card key={session.id} className="p-4 space-y-3">
              <button className="w-full text-left space-y-3" onClick={() => router.push(`/historico/${session.id}`)}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    {session.routineName && <h3 className="font-semibold text-lg">{session.routineName}</h3>}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {format(session.date, "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>

                  <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* EXERCÍCIOS */}
                <div className="space-y-2">
                  {session.exercises.map((item) => {
                    const category = getExerciseCategory(item.exerciseId)
                    return (
                      <div key={item.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <DumbbellIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{getExerciseName(item.exerciseId)}</span>
                          {category && (
                            <Badge variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          )}
                        </div>

                        <div className="ml-6 text-sm text-muted-foreground">
                          {item.sets.length} {item.sets.length === 1 ? "série" : "séries"}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* RODAPÉ */}
                <div className="pt-2 border-t flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {session.exercises.length} {session.exercises.length === 1 ? "exercício" : "exercícios"}
                  </span>

                  <span className="text-muted-foreground">{getTotalSets(session)} séries totais</span>
                </div>
              </button>

              {/* BOTÃO EXCLUIR */}
              <div className="pt-2 border-t flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive gap-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteSessionId(session.id)
                  }}
                >
                  <TrashIcon className="w-4 h-4" />
                  Excluir sessão
                </Button>
              </div>
            </Card>
          ))}

        {!loading && sessions.length === 0 && (
          <Card className="p-8 text-center space-y-3">
            <CalendarIcon className="w-8 h-8 text-muted-foreground mx-auto" />
            <h3 className="font-semibold">Nenhum treino ainda</h3>
            <p className="text-sm text-muted-foreground">Registre seu primeiro treino para ver o histórico aqui</p>
          </Card>
        )}
      </div>

      {/* CONFIRMAR EXCLUSÃO */}
      <AlertDialog open={!!deleteSessionId} onOpenChange={() => setDeleteSessionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir sessão?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteSessionId && handleDelete(deleteSessionId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
