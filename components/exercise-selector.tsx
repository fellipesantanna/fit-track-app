"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, PlusIcon, DumbbellIcon, MoreVerticalIcon, EditIcon, TrashIcon } from "@/components/icons"
import type { Exercise, ExerciseCategory } from "@/lib/types"
import { categoryLabels } from "@/lib/utils/category"
import { CreateExerciseDialog } from "./create-exercise-dialog"
import { EditExerciseDialog } from "./edit-exercise-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { useToast } from "@/hooks/use-toast"
import { exercisesApi } from "@/lib/exercises"
import { routinesApi } from "@/lib/routines"

interface ExerciseSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (exercise: Exercise) => void
}

export function ExerciseSelector({ open, onOpenChange, onSelect }: ExerciseSelectorProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | "all">("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [deleteExerciseId, setDeleteExerciseId] = useState<string | null>(null)
  const { toast } = useToast()

  // 🔥 CARREGAR EXERCÍCIOS DO SUPABASE
  useEffect(() => {
    if (open) {
      loadExercises()
    }
  }, [open])

  async function loadExercises() {
    try {
      const ex = await exercisesApi.getAll()
      setExercises(ex)
    } catch (e) {
      console.error(e)
    }
  }

  // 🔥 NOVO EXERCÍCIO CRIADO
  const handleExerciseCreated = async (exercise: Exercise) => {
    await loadExercises()
    setShowCreateDialog(false)
    onSelect(exercise)
  }

  // 🔥 EDITAR EXERCÍCIO
  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setShowEditDialog(true)
  }

  // 🔥 APÓS SALVAR EDIÇÃO
  const handleExerciseUpdated = async () => {
    await loadExercises()
    setEditingExercise(null)
    toast({
      title: "Exercício atualizado",
      description: "As alterações foram salvas com sucesso",
    })
  }

  // 🔥 APAGAR EXERCÍCIO
  const handleDeleteExercise = async (id: string) => {
    try {
      await exercisesApi.softDelete(id)

      // Remover também de rotinas vinculadas
      const routines = await routinesApi.getAll()
      for (const routine of routines) {
        // Cada rotina agora vem com routine_exercises
        const hasExercise = routine.routine_exercises?.some(re => re.exercise_id === id)
        if (hasExercise) {
          await routinesApi.removeExerciseFromRoutine(routine.id, id)
        }
      }

      await loadExercises()
      toast({
        title: "Exercício excluído",
        description: "O exercício foi removido do catálogo",
      })
    } catch (e) {
      console.error(e)
    }

    setDeleteExerciseId(null)
  }

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: "all", label: "Todos" },
    { value: "weight-reps", label: "Peso & Reps" },
    { value: "bodyweight-reps", label: "Peso Corporal" },
    { value: "duration", label: "Duração" },
    { value: "distance-duration", label: "Distância" },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col w-full">
          <DialogHeader>
            <DialogTitle>Adicionar exercício</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Procurar exercício"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-3 mb-2 scrollbar-hide">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 -mx-1 px-1">
              {filteredExercises.length === 0 ? (
                <div className="text-center py-8">
                  <DumbbellIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "Nenhum exercício encontrado" : "Nenhum exercício cadastrado"}
                  </p>
                </div>
              ) : (
                filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors"
                  >
                    <button
                      onClick={() => onSelect(exercise)}
                      className="flex items-center gap-3 flex-1 text-left min-w-0"
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <DumbbellIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {categoryLabels[exercise.category]}
                        </p>
                      </div>
                    </button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVerticalIcon className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditExercise(exercise)}>
                          <EditIcon className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteExerciseId(exercise.id)}
                          className="text-destructive"
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Apagar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              )}
            </div>

            <Button className="w-full gap-2" onClick={() => setShowCreateDialog(true)}>
              <PlusIcon className="w-4 h-4" />
              Criar novo exercício
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CreateExerciseDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleExerciseCreated}
      />

      <EditExerciseDialog
        exercise={editingExercise}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleExerciseUpdated}
      />

      <AlertDialog open={!!deleteExerciseId} onOpenChange={() => setDeleteExerciseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar exercício?</AlertDialogTitle>
            <AlertDialogDescription>
              Isto irá remover o exercício do catálogo e das suas rotinas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteExerciseId && handleDeleteExercise(deleteExerciseId)}>
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
