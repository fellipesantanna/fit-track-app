"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon, MoreVerticalIcon, PlayIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { routinesApi } from "@/lib/routines"
import { exercisesApi } from "@/lib/exercises"
import type { Routine, Exercise } from "@/lib/types"
import { CreateRoutineDialog } from "@/components/create-routine-dialog"
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

export default function HomePage() {
  const router = useRouter()

  const [routines, setRoutines] = useState<Routine[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [deleteRoutineId, setDeleteRoutineId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [loading, setLoading] = useState(true)

  // ---------------------------------------------------------------
  // LOAD DATA
  // ---------------------------------------------------------------
  const loadData = async () => {
    setLoading(true)

    const [dbRoutines, dbExercises] = await Promise.all([routinesApi.getAll(), exercisesApi.getAll()])

    setRoutines(dbRoutines)
    setExercises(dbExercises)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // ---------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------
  const handleStartEmptyWorkout = () => router.push("/sessao")

  const handleStartRoutine = (id: string) => router.push(`/sessao?routineId=${id}`)

  const handleEditRoutine = (id: string) => router.push(`/rotina/${id}`)

  const handleDeleteRoutine = async (id: string) => {
    await routinesApi.softDelete(id)
    await loadData()
    setDeleteRoutineId(null)
  }

  const handleRoutineCreated = async () => {
    await loadData()
    setShowCreateDialog(false)
  }

  // ---------------------------------------------------------------
  // UTILS
  // ---------------------------------------------------------------
  const getRoutineExerciseSummary = (routine: Routine) => {
    if (!routine.routine_exercises?.length) return "Nenhum exercício"

    const names = routine.routine_exercises
      .map((re) => exercises.find((x) => x.id === re.exercise_id)?.name)
      .filter(Boolean)

    return names.join(", ") || "Nenhum exercício"
  }

  // ---------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------
  return (
    <main className="max-w-lg mx-auto p-4 pb-24 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Treino</h1>
      </div>

      <Button size="lg" className="w-full h-14 text-lg gap-2" onClick={() => setShowCreateDialog(true)}>
        <PlusIcon className="w-5 h-5" />
        Nova rotina
      </Button>

      <Button
        variant="outline"
        size="default"
        className="w-full gap-2 bg-transparent"
        onClick={handleStartEmptyWorkout}
      >
        <PlayIcon className="w-4 h-4 fill-current" />
        Iniciar treino vazio
      </Button>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Minhas Rotinas</h2>
        </div>

        {/* LOADING STATE */}
        {loading && <Card className="p-8 text-center text-muted-foreground">Carregando rotinas...</Card>}

        {/* EMPTY STATE */}
        {!loading && routines.length === 0 && (
          <Card className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
              <PlusIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">Nenhuma rotina criada</h3>
              <p className="text-sm text-muted-foreground">Crie uma rotina para começar seus treinos</p>
            </div>
          </Card>
        )}

        {/* ROUTINE LIST */}
        {!loading && routines.length > 0 && (
          <div className="space-y-3">
            {routines.map((routine) => (
              <Card key={routine.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">{routine.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{getRoutineExerciseSummary(routine)}</p>

                    <Button size="sm" className="w-full gap-2" onClick={() => handleStartRoutine(routine.id)}>
                      <PlayIcon className="w-4 h-4 fill-current" />
                      Iniciar rotina
                    </Button>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVerticalIcon className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditRoutine(routine.id)}>Editar rotina</DropdownMenuItem>

                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteRoutineId(routine.id)}>
                        Excluir rotina
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CREATE ROUTINE */}
      <CreateRoutineDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleRoutineCreated}
      />

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={!!deleteRoutineId} onOpenChange={() => setDeleteRoutineId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir rotina?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A rotina será excluída permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteRoutineId && handleDeleteRoutine(deleteRoutineId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
