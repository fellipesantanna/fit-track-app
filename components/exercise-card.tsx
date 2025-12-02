"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TrashIcon, PlusIcon, MinusIcon } from "@/components/icons"
import type { WorkoutExercise } from "@/lib/types"

interface ExerciseCardProps {
  exercise: WorkoutExercise
  onUpdate: (id: string, exercise: WorkoutExercise) => void
  onRemove: (id: string) => void
}

export function ExerciseCard({ exercise, onUpdate, onRemove }: ExerciseCardProps) {
  const handleSetChange = (index: number, field: "reps" | "weight", value: string) => {
    const newSets = [...exercise.sets]
    newSets[index] = {
      ...newSets[index],
      [field]: Number.parseFloat(value) || 0,
    }
    onUpdate(exercise.id, { ...exercise, sets: newSets })
  }

  const handleAddSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1] || { reps: 0, weight: 0 }
    onUpdate(exercise.id, {
      ...exercise,
      sets: [...exercise.sets, { ...lastSet }],
    })
  }

  const handleRemoveSet = (index: number) => {
    if (exercise.sets.length <= 1) return
    const newSets = exercise.sets.filter((_, i) => i !== index)
    onUpdate(exercise.id, { ...exercise, sets: newSets })
  }

  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{exercise.exerciseName}</h3>
          <Badge variant="secondary" className="mt-1 text-xs">
            {exercise.category}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(exercise.id)}
          className="text-destructive hover:text-destructive"
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Sets */}
      <div className="space-y-2">
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 text-xs font-medium text-muted-foreground mb-2">
          <div className="w-8">Set</div>
          <div>Reps</div>
          <div>Kg</div>
          <div className="w-8"></div>
        </div>

        {exercise.sets.map((set, index) => (
          <div key={index} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center">
            <div className="w-8 h-9 rounded-md bg-muted flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <Input
              type="number"
              value={set.reps || ""}
              onChange={(e) => handleSetChange(index, "reps", e.target.value)}
              placeholder="0"
              className="h-9"
            />
            <Input
              type="number"
              value={set.weight || ""}
              onChange={(e) => handleSetChange(index, "weight", e.target.value)}
              placeholder="0"
              step="0.5"
              className="h-9"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveSet(index)}
              disabled={exercise.sets.length <= 1}
              className="h-9 w-8"
            >
              <MinusIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Set Button */}
      <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleAddSet}>
        <PlusIcon className="w-4 h-4 mr-2" />
        Adicionar Série
      </Button>
    </Card>
  )
}
