"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Timer,
  Gauge,
  Footprints,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { WorkoutSet, ExerciseCategory, Exercise } from "@/lib/types"
import { SessionSetCard } from "./SessionSetCard"
import { SetEditor } from "./SetEditor"

interface SessionExerciseCardProps {
  exercise: Exercise
  type: ExerciseCategory
  sets: WorkoutSet[]
  onChange: (sets: WorkoutSet[]) => void
}

export function SessionExerciseCard({
  exercise,
  type,
  sets,
  onChange
}: SessionExerciseCardProps) {

  const [open, setOpen] = useState(true)
  const [editingSetId, setEditingSetId] = useState<string | null>(null)

  const iconMap: Record<ExerciseCategory, any> = {
    "weight-reps": Dumbbell,
    "bodyweight-reps": Footprints,
    "duration": Timer,
    "distance-duration": Gauge
  }

  const Icon = iconMap[type]

  function addSet() {
    const newSet: WorkoutSet = {
      id: crypto.randomUUID(),
      setIndex: sets.length,
      weightKg: type === "weight-reps" ? 20 : null,
      reps: type === "weight-reps" || type === "bodyweight-reps" ? 10 : null,
      durationSec: type === "duration" || type === "distance-duration" ? 30 : null,
      distanceM: type === "distance-duration" ? 100 : null,
    }

    onChange([...sets, newSet])
    setEditingSetId(newSet.id)
  }

  function updateSet(id: string, value: WorkoutSet) {
    const updated = sets.map(s => s.id === id ? value : s)
    onChange(updated)
  }

  function removeSet(id: string) {
    const filtered = sets
      .filter(s => s.id !== id)
      .map((s, idx) => ({ ...s, setIndex: idx }))
    onChange(filtered)
  }

  function duplicateSet(id: string) {
    const target = sets.find(s => s.id === id)
    if (!target) return

    const newOne: WorkoutSet = {
      ...target,
      id: crypto.randomUUID(),
      setIndex: sets.length
    }

    onChange([...sets, newOne])
  }

  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl border bg-card dark:bg-card/80 p-4 shadow-sm flex flex-col gap-3"
      )}
    >

      {/* HEADER */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
            <Icon className="h-6 w-6 text-purple-800 dark:text-purple-300" />
          </div>

          <div>
            <div className="font-semibold text-lg">{exercise.name}</div>
            <div className="text-sm text-muted-foreground">{type}</div>
          </div>
        </div>

        <div className="ml-auto">
          {open ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* COLLAPSE */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            layout
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-3 mt-2"
          >

            {/* LISTA DE SETS */}
            <div className="flex flex-col gap-2">
              {sets.map((s) => (
                <div key={s.id}>
                  <SessionSetCard
                    set={s}
                    type={type}
                    onEdit={() => setEditingSetId(s.id)}
                    onDuplicate={() => duplicateSet(s.id)}
                    onRemove={() => removeSet(s.id)}
                  />

                  {/* EDITOR INLINE */}
                  <AnimatePresence>
                    {editingSetId === s.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2"
                      >
                        <SetEditor
                          type={type}
                          value={s}
                          onChange={(val) => updateSet(s.id, val)}
                          onDuplicate={() => duplicateSet(s.id)}
                          onRemove={() => removeSet(s.id)}
                        />

                        <div className="flex justify-end mt-2">
                          <Button
                            variant="secondary"
                            onClick={() => setEditingSetId(null)}
                          >
                            Fechar
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* BOTÃO ADICIONAR SET */}
            <Button
              variant="outline"
              onClick={addSet}
              className="flex items-center gap-2 justify-center"
            >
              <Plus className="w-4 h-4" />
              Adicionar set
            </Button>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
