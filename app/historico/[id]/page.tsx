"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, DumbbellIcon, TrashIcon, CopyIcon, CalendarIcon } from "@/components/icons"

import { sessionsApi } from "@/lib/sessions"
import { exercisesApi } from "@/lib/exercises"

import type { WorkoutSession, Exercise } from "@/lib/types"

import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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

export default function HistoricoDetalhePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const sessionId = params.id as string

  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState(false)

  // --------------------------
  // LOAD DATA
  // --------------------------
  const loadSession = async () => {
    try {
      setLoading(true)

      const [dbSession, allExercises] = await Promise.all([sessionsApi.getById(sessionId), exercisesApi.getAll()])

      if (!dbSession) {
        toast({
          title: "Sessão não encontrada",
          variant: "destructive",
        })
        router.push("/historico")
        return
      }

      setSession(dbSession)
      setExercises(allExercises)
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro ao carregar sessão",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSession()
  }, [sessionId])

  // --------------------------
  // HELPERS
  // --------------------------
  const getExercise = (id: string) => exercises.find((e) => e.id === id)
  const totalSets = session?.exercises.reduce((acc, ex) => acc + ex.sets.length, 0) ?? 0

  // --------------------------
  // DELETE SESSION
  // --------------------------
  const handleDelete = async () => {
    try {
      await sessionsApi.delete(sessionId)
      toast({
        title: "Sessão excluída",
      })
      router.push("/historico")
    } catch (err) {
      console.error(err)
      toast({
        title: "Erro ao excluir sessão",
        variant: "destructive",
      })
    }
  }

  // --------------------------
  // DUPLICAR SESSÃO
  // --------------------------
  const duplicateSession = async () => {
    if (!session) return

    await sessionsApi.create({
      date: new Date().toISOString(),
      routineId: session.routineId ?? undefined,
      routineName: session.routineName ?? undefined,
      exercises: session.exercises.map((e) => ({
        id: crypto.randomUUID(),
        exerciseId: e.exerciseId,
        sets: e.sets.map((s) => ({ ...s })),
        notes: e.notes || "",
      })),
    } as any)

    toast({
      title: "Sessão duplicada",
      description: "A nova sessão foi criada com sucesso.",
    })

    router.push("/historico")
  }

  // --------------------------
  // RENDER
  // --------------------------
  if (loading || !session) {
    return <main className="p-6 text-center text-muted-foreground">Carregando sessão...</main>
  }

  return (
    <main className="max-w-lg mx-auto p-4 pb-24 space-y-6">
      {/* HEADER */}
      <div className="sticky top-0 bg-background z-10 p-4 border-b flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>

        <h1 className="text-xl font-bold flex-1 truncate">{session.routineName || "Treino"}</h1>

        <Button variant="ghost" size="icon" onClick={() => setDeleteDialog(true)}>
          <TrashIcon className="w-5 h-5 text-destructive" />
        </Button>
      </div>

      {/* RESUMO */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="w-4 h-4" />
          {format(session.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span>{session.exercises.length} exercício(s)</span>
          <span>{totalSets} série(s)</span>
        </div>

        <Button size="sm" variant="outline" className="gap-2 bg-transparent" onClick={duplicateSession}>
          <CopyIcon className="w-4 h-4" /> Duplicar sessão
        </Button>
      </Card>

      {/* EXERCÍCIOS */}
      <div className="space-y-4">
        {session.exercises.map((item) => {
          const ex = getExercise(item.exerciseId)
          if (!ex) return null

          return (
            <Card key={item.id} className="p-4 space-y-4">
              <div className="flex items-start gap-2">
                <DumbbellIcon className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{ex.name}</h3>
                  <Badge variant="secondary">{ex.category}</Badge>

                  {item.advancedTechnique && (
                    <p className="text-xs italic text-muted-foreground mt-1">Técnica: {item.advancedTechnique}</p>
                  )}
                </div>
              </div>

              {/* LISTA DE SETS */}
              <div className="space-y-2">
                {item.sets.map((s, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg text-sm space-y-1">
                    <div className="font-medium">Série {index + 1}</div>

                    {s.weightKg !== undefined && <div>Peso: {s.weightKg} kg</div>}

                    {s.reps !== undefined && <div>Reps: {s.reps}</div>}

                    {s.durationSec !== undefined && (
                      <div>
                        Duração: {Math.floor(s.durationSec / 60)}min {s.durationSec % 60}s
                      </div>
                    )}

                    {s.distanceM !== undefined && <div>Distância: {s.distanceM} m</div>}
                  </div>
                ))}
              </div>

              {/* NOTAS */}
              {item.notes && (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Notas</div>
                  <p className="text-sm">{item.notes}</p>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* CONFIRMAR EXCLUSÃO */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir sessão?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction className="bg-destructive text-white" onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
