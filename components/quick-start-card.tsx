"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CopyIcon, CalendarIcon } from "@/components/icons"
import type { Workout } from "@/lib/types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface QuickStartCardProps {
  workout: Workout
  onStart: () => void
}

export function QuickStartCard({ workout, onStart }: QuickStartCardProps) {
  const exerciseCount = workout.exercises.length
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarIcon className="w-3 h-3" />
            <span>{format(workout.date, "dd MMM", { locale: ptBR })}</span>
          </div>
          <p className="text-sm font-medium">
            {exerciseCount} {exerciseCount === 1 ? "exercício" : "exercícios"} • {totalSets} séries
          </p>
          <div className="flex gap-1 flex-wrap">
            {workout.exercises.slice(0, 3).map((ex, i) => (
              <span key={i} className="text-xs text-muted-foreground">
                {ex.exerciseName}
                {i < Math.min(workout.exercises.length, 3) - 1 ? "," : ""}
              </span>
            ))}
            {workout.exercises.length > 3 && (
              <span className="text-xs text-muted-foreground">+{workout.exercises.length - 3}</span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onStart}>
          <CopyIcon className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
