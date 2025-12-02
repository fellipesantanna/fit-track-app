"use client"

import { useState } from "react"
import { XIcon, PlusIcon, CheckIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AddExerciseDialog } from "@/components/add-exercise-dialog"
import { ExerciseCard } from "@/components/exercise-card"
import { useToast } from "@/hooks/use-toast"
import { storage } from "@/lib/storage"
import type { WorkoutExercise } from "@/lib/types"

interface WorkoutSessionProps {
  onComplete: () => void
}

export function WorkoutSession({ onComplete }: WorkoutSessionProps) {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddExercise = (exercise: WorkoutExercise) => {
    setExercises((prev) => [...prev, exercise])
    setIsAddDialogOpen(false)
  }

  const handleUpdateExercise = (id: string, updated: WorkoutExercise) => {
    setExercises((prev) => prev.map((ex) => (ex.id === id ? updated : ex)))
  }

  const handleRemoveExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id))
  }

  const handleFinishWorkout = () => {
    if (exercises.length === 0) {
      toast({
        title: "Adicione pelo menos um exercício",
        variant: "destructive",
      })
      return
    }

    storage.saveWorkout({
      date: new Date(),
      exercises,
    })

    toast({
      title: "Treino salvo!",
      description: `${exercises.length} ${exercises.length === 1 ? "exercício registrado" : "exercícios registrados"}`,
    })

    onComplete()
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold">Treino em Andamento</h1>
            <p className="text-sm text-muted-foreground">
              {exercises.length} {exercises.length === 1 ? "exercício" : "exercícios"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onComplete}>
            <XIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 p-4 space-y-3">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdate={handleUpdateExercise}
            onRemove={handleRemoveExercise}
          />
        ))}

        {/* Add Exercise Button */}
        <Button
          variant="outline"
          className="w-full h-20 border-dashed bg-transparent"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Adicionar Exercício
        </Button>

        {/* Empty State */}
        {exercises.length === 0 && (
          <Card className="p-8 text-center space-y-3 mt-8">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
              <PlusIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">Nenhum exercício adicionado</h3>
              <p className="text-sm text-muted-foreground">Comece adicionando seu primeiro exercício</p>
            </div>
          </Card>
        )}
      </div>

      {/* Footer */}
      {exercises.length > 0 && (
        <div className="sticky bottom-16 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
          <Button size="lg" className="w-full gap-2" onClick={handleFinishWorkout}>
            <CheckIcon className="w-5 h-5" />
            Finalizar Treino
          </Button>
        </div>
      )}

      <AddExerciseDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddExercise} />
    </div>
  )
}
