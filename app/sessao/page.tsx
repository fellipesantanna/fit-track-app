"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeftIcon, PlusIcon, GripVerticalIcon, XIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { StopwatchInput } from "@/components/stopwatch-input"
import { Textarea } from "@/components/ui/textarea"

import { exercisesApi } from "@/lib/exercises"
import { routinesApi } from "@/lib/routines"
import { sessionsApi } from "@/lib/sessions"
import type { Exercise } from "@/lib/types"

import { ExerciseSelector } from "@/components/exercise-selector-broken"
import { useToast } from "@/hooks/use-toast"

export default function SessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const routineId = searchParams.get("routineId")

  const { toast } = useToast()

  const [allExercises, setAllExercises] = useState<Exercise[]>([])

  /**
   * Estrutura interna da página
   */
  interface SetEntry {
    setIndex: number
    weightKg?: number
    reps?: number
    durationSec?: number
    distanceM?: number
  }

  interface SessionExerciseEntry {
    exerciseId: string
    exercise: Exercise
    position: number
    notes?: string
    advancedTechnique?: string
    isDone?: boolean
    sets: SetEntry[]
  }

  const [sessionExercises, setSessionExercises] = useState<SessionExerciseEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showSelector, setShowSelector] = useState(false)

  const [dragIndex, setDragIndex] = useState<number | null>(null)

  // -------------------------------------------------------------
  // CARREGAR ROTINA (SE HOUVER) + EXERCÍCIOS
  // -------------------------------------------------------------
  useEffect(() => {
    async function loadSession() {
      setLoading(true)

      const exercises = await exercisesApi.getAll()
      setAllExercises(exercises)

      // MODO: Treino baseado em rotina
      if (routineId) {
        const routine = await routinesApi.getById(routineId)
        if (!routine) {
          toast({
            title: "Rotina não encontrada",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        const mapped = routine.routine_exercises
          ?.sort((a, b) => a.position - b.position)
          .map((re) => {
            const ex = exercises.find((e) => e.id === re.exercise_id)!
            const sets = []

            // Sets sugeridos (se existir suggested_sets)
            if (re.suggested_sets) {
              for (let i = 0; i < re.suggested_sets; i++) {
                sets.push({
                  setIndex: i,
                  reps: re.suggested_reps ?? undefined,
                })
              }
            }

            return {
              exerciseId: ex.id,
              exercise: ex,
              position: re.position,
              notes: "",
              advancedTechnique: re.advanced_technique ?? undefined,
              sets,
            } as SessionExerciseEntry
          })

        setSessionExercises(mapped ?? [])
      }

      setLoading(false)
    }

    loadSession()
  }, [routineId, router, toast])

  // -------------------------------------------------------------
  // ADICIONAR EXERCÍCIO MANUALMENTE
  // -------------------------------------------------------------
  const handleAddExercise = (exercise: Exercise) => {
    setSessionExercises((prev) => [
      ...prev,
      {
        exerciseId: exercise.id,
        exercise,
        position: prev.length,
        sets: [],
        notes: "",
      },
    ])
    setShowSelector(false)
  }

  // -------------------------------------------------------------
  // REMOVER
  // -------------------------------------------------------------
  const removeExercise = (index: number) => {
    setSessionExercises((prev) => prev.filter((_, i) => i !== index).map((ex, i) => ({ ...ex, position: i })))
  }

  // -------------------------------------------------------------
  // ADD SET
  // -------------------------------------------------------------
  const addSet = (exerciseIndex: number) => {
    setSessionExercises((prev) =>
      prev.map((ex, i) =>
        i === exerciseIndex
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  setIndex: ex.sets.length,
                },
              ],
            }
          : ex,
      ),
    )
  }

  // -------------------------------------------------------------
  // REMOVE SET
  // -------------------------------------------------------------
  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setSessionExercises((prev) =>
      prev.map((ex, i) =>
        i === exerciseIndex
          ? {
              ...ex,
              sets: ex.sets.filter((_, s) => s !== setIndex).map((s, newIndex) => ({ ...s, setIndex: newIndex })),
            }
          : ex,
      ),
    )
  }

  // -------------------------------------------------------------
  // UPDATE SET VALUES
  // -------------------------------------------------------------
  const updateSet = (exerciseIndex: number, setIndex: number, updates: Partial<SetEntry>) => {
    setSessionExercises((prev) =>
      prev.map((ex, i) =>
        i === exerciseIndex
          ? {
              ...ex,
              sets: ex.sets.map((s, si) => (si === setIndex ? { ...s, ...updates } : s)),
            }
          : ex,
      ),
    )
  }

  // -------------------------------------------------------------
  // DRAG & DROP EXERCÍCIOS
  // -------------------------------------------------------------
  const handleDragStart = (index: number) => setDragIndex(index)

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return

    setSessionExercises((prev) => {
      const list = [...prev]
      const dragged = list[dragIndex]
      list.splice(dragIndex, 1)
      list.splice(index, 0, dragged)
      return list.map((item, i) => ({ ...item, position: i }))
    })

    setDragIndex(index)
  }

  const handleDragEnd = () => setDragIndex(null)

  // -------------------------------------------------------------
  // SALVAR TREINO NO SUPABASE
  // -------------------------------------------------------------
  const saveSession = async () => {
    if (sessionExercises.length === 0) {
      toast({
        title: "Adicione exercícios ao treino",
        variant: "destructive",
      })
      return
    }

    const payload = {
      exercises: sessionExercises,
      finishedAt: new Date().toISOString(),
    }

    await sessionsApi.create({
      routineId: routineId ?? undefined,
      routineName: undefined,
      date: new Date().toISOString(),
      exercises: sessionExercises,
    } as any)

    toast({
      title: "Treino salvo!",
      description: "Sua sessão foi registrada com sucesso.",
    })

    router.push("/historico")
  }

  // -------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------
  if (loading) {
    return <main className="p-6 text-muted-foreground">Carregando treino...</main>
  }

  return (
    <main className="max-w-lg mx-auto pb-24">
      <div className="sticky top-0 bg-background z-10 p-4 border-b flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Treino</h1>
        <Button className="ml-auto" onClick={saveSession}>
          Finalizar
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {sessionExercises.length === 0 && (
          <Card className="p-6 text-center text-muted-foreground">Nenhum exercício adicionado</Card>
        )}

        {sessionExercises.map((ex, exerciseIndex) => (
          <Card
            key={exerciseIndex}
            className="p-4 space-y-4"
            draggable
            onDragStart={() => handleDragStart(exerciseIndex)}
            onDragOver={(e) => handleDragOver(e, exerciseIndex)}
            onDragEnd={handleDragEnd}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVerticalIcon className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">{ex.exercise.name}</h3>
              </div>

              <Button variant="ghost" size="icon" onClick={() => removeExercise(exerciseIndex)}>
                <XIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* SETS */}
            <div className="space-y-3">
              {ex.sets.map((set, setIndex) => (
                <div key={setIndex} className="p-3 bg-muted rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Peso (kg)</Label>
                      <Input
                        type="number"
                        value={set.weightKg ?? ""}
                        onChange={(e) =>
                          updateSet(exerciseIndex, setIndex, {
                            weightKg: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>Reps</Label>
                      <Input
                        type="number"
                        value={set.reps ?? ""}
                        onChange={(e) =>
                          updateSet(exerciseIndex, setIndex, {
                            reps: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Duração (seg)</Label>
                      <StopwatchInput
                        value={set.durationSec ?? 0}
                        onChange={(val) => updateSet(exerciseIndex, setIndex, { durationSec: val })}
                      />
                    </div>

                    <div>
                      <Label>Distância (m)</Label>
                      <Input
                        type="number"
                        value={set.distanceM ?? ""}
                        onChange={(e) =>
                          updateSet(exerciseIndex, setIndex, {
                            distanceM: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => removeSet(exerciseIndex, setIndex)}
                  >
                    Remover série
                  </Button>
                </div>
              ))}

              <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => addSet(exerciseIndex)}>
                <PlusIcon className="w-4 h-4" />
                Adicionar série
              </Button>
            </div>

            {/* NOTAS */}
            <div className="space-y-2">
              <Label>Anotações</Label>
              <Textarea
                rows={2}
                value={ex.notes ?? ""}
                onChange={(e) =>
                  setSessionExercises((prev) =>
                    prev.map((item, i) => (i === exerciseIndex ? { ...item, notes: e.target.value } : item)),
                  )
                }
              />
            </div>
          </Card>
        ))}

        <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => setShowSelector(true)}>
          <PlusIcon className="w-4 h-4" />
          Adicionar exercício
        </Button>
      </div>

      {/* SELECTOR */}
      <ExerciseSelector open={showSelector} onOpenChange={setShowSelector} onSelect={handleAddExercise} />
    </main>
  )
}
