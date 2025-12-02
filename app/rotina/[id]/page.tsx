"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeftIcon, PlusIcon, XIcon, GripVerticalIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { routinesApi } from "@/lib/routines"
import { exercisesApi } from "@/lib/exercises"
import type { Routine, Exercise } from "@/lib/types"
import { ExerciseSelector } from "@/components/exercise-selector-broken"
import { useToast } from "@/hooks/use-toast"

interface ExerciseWithConfig {
  exerciseId: string
  exercise: Exercise
  suggestedSets?: number
  suggestedReps?: number
  advancedTechnique?: string
  position: number
}

export default function EditRoutinePage() {
  const router = useRouter()
  const params = useParams()
  const routineId = params.id as string

  const { toast } = useToast()

  const [routine, setRoutine] = useState<Routine | null>(null)
  const [name, setName] = useState("")
  const [allExercises, setAllExercises] = useState<Exercise[]>([])
  const [exercisesWithConfig, setExercisesWithConfig] = useState<ExerciseWithConfig[]>([])
  const [showSelector, setShowSelector] = useState(false)

  const [loading, setLoading] = useState(true)

  const [dragIndex, setDragIndex] = useState<number | null>(null)

  // -------------------------------------------------------
  // LOAD DATA
  // -------------------------------------------------------
  useEffect(() => {
    async function load() {
      setLoading(true)

      const [routineData, exercises] = await Promise.all([routinesApi.getById(routineId), exercisesApi.getAll()])

      setAllExercises(exercises)

      if (!routineData) {
        toast({
          title: "Rotina não encontrada",
          description: "Tente novamente.",
          variant: "destructive",
        })
        router.push("/")
        return
      }

      setRoutine(routineData)
      setName(routineData.name)

      const mapped: ExerciseWithConfig[] =
        routineData.routine_exercises
          ?.sort((a, b) => a.position - b.position)
          .map((re) => {
            const ex = exercises.find((e) => e.id === re.exercise_id)
            return {
              exerciseId: re.exercise_id,
              exercise: ex!,
              suggestedSets: re.suggested_sets ?? undefined,
              suggestedReps: re.suggested_reps ?? undefined,
              advancedTechnique: re.advanced_technique ?? undefined,
              position: re.position,
            }
          }) ?? []

      setExercisesWithConfig(mapped)
      setLoading(false)
    }

    load()
  }, [routineId, router, toast])

  // -------------------------------------------------------
  // UPDATE CONFIG
  // -------------------------------------------------------
  const updateConfig = (index: number, updates: Partial<ExerciseWithConfig>) => {
    setExercisesWithConfig((prev) => prev.map((item, i) => (i === index ? { ...item, ...updates } : item)))
  }

  // -------------------------------------------------------
  // ADD EXERCISE
  // -------------------------------------------------------
  const addExercise = (exercise: Exercise) => {
    if (exercisesWithConfig.find((e) => e.exerciseId === exercise.id)) {
      setShowSelector(false)
      return
    }

    setExercisesWithConfig((prev) => [
      ...prev,
      {
        exerciseId: exercise.id,
        exercise,
        position: prev.length,
      },
    ])

    setShowSelector(false)
  }

  // -------------------------------------------------------
  // REMOVE EXERCISE
  // -------------------------------------------------------
  const removeExercise = (index: number) => {
    setExercisesWithConfig((prev) => prev.filter((_, i) => i !== index))
  }

  // -------------------------------------------------------
  // DRAG & DROP
  // -------------------------------------------------------
  const handleDragStart = (index: number) => setDragIndex(index)

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return

    setExercisesWithConfig((prev) => {
      const list = [...prev]
      const dragged = list[dragIndex]
      list.splice(dragIndex, 1)
      list.splice(index, 0, dragged)

      return list.map((item, i) => ({ ...item, position: i }))
    })

    setDragIndex(index)
  }

  const handleDragEnd = () => setDragIndex(null)

  // -------------------------------------------------------
  // SAVE ROUTINE
  // -------------------------------------------------------
  const saveRoutine = async () => {
    if (!name.trim() || exercisesWithConfig.length === 0) {
      toast({ title: "Erro", description: "Preencha o nome e adicione exercícios.", variant: "destructive" })
      return
    }

    try {
      await routinesApi.update(
        routineId,
        name.trim(),
        exercisesWithConfig.map((item, index) => ({
          exerciseId: item.exerciseId,
          suggestedSets: item.suggestedSets,
          suggestedReps: item.suggestedReps,
          advancedTechnique: item.advancedTechnique,
          position: index,
        })),
      )

      toast({
        title: "Rotina salva",
        description: "As alterações foram registradas com sucesso.",
      })

      router.push("/")
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      })
    }
  }

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  if (loading || !routine) {
    return (
      <main className="max-w-lg mx-auto p-4 pb-24">
        <p className="text-muted-foreground">Carregando rotina...</p>
      </main>
    )
  }

  return (
    <main className="max-w-lg mx-auto pb-24">
      <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Editar rotina</h1>
        </div>
        <Button onClick={saveRoutine} disabled={!name.trim() || exercisesWithConfig.length === 0}>
          Salvar
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Nome */}
        <div className="space-y-2">
          <Label>Título da rotina</Label>
          <Input placeholder="Ex: Série A, Peito/Tríceps" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Exercícios */}
        <div className="space-y-3">
          <Label>Exercícios da rotina</Label>

          {/* SE VAZIO */}
          {exercisesWithConfig.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <PlusIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Adicione exercícios à sua rotina</p>
            </div>
          )}

          {/* LISTA */}
          {exercisesWithConfig.length > 0 && (
            <div className="space-y-3">
              {exercisesWithConfig.map((item, index) => (
                <div
                  key={item.exerciseId}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className="p-3 bg-muted rounded-lg space-y-3 cursor-move"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <GripVerticalIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.exercise.name}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => removeExercise(index)}
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Config */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Séries sugeridas</Label>
                      <Input
                        type="number"
                        value={item.suggestedSets ?? ""}
                        onChange={(e) =>
                          updateConfig(index, {
                            suggestedSets: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Reps sugeridas</Label>
                      <Input
                        type="number"
                        value={item.suggestedReps ?? ""}
                        onChange={(e) =>
                          updateConfig(index, {
                            suggestedReps: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Técnica avançada</Label>
                    <Textarea
                      rows={2}
                      value={item.advancedTechnique ?? ""}
                      onChange={(e) => updateConfig(index, { advancedTechnique: e.target.value })}
                      className="resize-none text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => setShowSelector(true)}>
            <PlusIcon className="w-4 h-4" />
            Adicionar exercício
          </Button>
        </div>
      </div>

      <ExerciseSelector open={showSelector} onOpenChange={setShowSelector} onSelect={addExercise} />
    </main>
  )
}
