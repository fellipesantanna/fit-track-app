"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SearchIcon } from "@/components/icons"
import { storage } from "@/lib/storage"
import type { Exercise, ExerciseCategory, WorkoutExercise } from "@/lib/types"

interface AddExerciseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (exercise: WorkoutExercise) => void
}

export function AddExerciseDialog({ open, onOpenChange, onAdd }: AddExerciseDialogProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newExerciseName, setNewExerciseName] = useState("")
  const [newExerciseCategory, setNewExerciseCategory] = useState<ExerciseCategory>("musculacao")

  useEffect(() => {
    if (open) {
      setExercises(storage.getExercises())
      setSearchQuery("")
      setNewExerciseName("")
    }
  }, [open])

  const filteredExercises = exercises.filter((ex) => ex.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectExercise = (exercise: Exercise) => {
    const workoutExercise: WorkoutExercise = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      sets: [{ reps: 0, weight: 0 }],
      date: new Date(),
    }
    onAdd(workoutExercise)
  }

  const handleCreateExercise = () => {
    if (!newExerciseName.trim()) return

    const exercise = storage.saveExercise({
      name: newExerciseName.trim(),
      category: newExerciseCategory,
    })

    const workoutExercise: WorkoutExercise = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      sets: [{ reps: 0, weight: 0 }],
      date: new Date(),
    }

    onAdd(workoutExercise)
    setNewExerciseName("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Adicionar Exercício</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="select" className="flex-1 flex flex-col">
          <TabsList className="mx-6 mb-4">
            <TabsTrigger value="select" className="flex-1">
              Selecionar
            </TabsTrigger>
            <TabsTrigger value="create" className="flex-1">
              Criar Novo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="flex-1 m-0 px-6 pb-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar exercício..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Exercise List */}
            <ScrollArea className="h-[400px] -mx-6 px-6">
              {filteredExercises.length > 0 ? (
                <div className="space-y-2">
                  {filteredExercises.map((exercise) => (
                    <Card
                      key={exercise.id}
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSelectExercise(exercise)}
                    >
                      <div className="font-medium">{exercise.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{exercise.category}</div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">
                    {searchQuery ? "Nenhum exercício encontrado" : "Nenhum exercício cadastrado"}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="create" className="m-0 px-6 pb-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Exercício</Label>
              <Input
                id="name"
                placeholder="Ex: Supino reto"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={newExerciseCategory}
                onValueChange={(value) => setNewExerciseCategory(value as ExerciseCategory)}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="musculacao">Musculação</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="funcional">Funcional</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleCreateExercise} disabled={!newExerciseName.trim()}>
              Criar e Adicionar
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
