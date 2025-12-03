"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { WorkoutSet, ExerciseCategory } from "@/lib/types"
import { Dumbbell, Timer, Gauge, Copy, Plus, Minus } from "lucide-react"

interface SetEditorProps {
  type: ExerciseCategory
  value: WorkoutSet
  onChange: (set: WorkoutSet) => void
  onDuplicate?: () => void
  onRemove?: () => void
}

export function SetEditor({
  type,
  value,
  onChange,
  onDuplicate,
  onRemove
}: SetEditorProps) {

  const [weight, setWeight] = useState<number>(value.weightKg ?? 0)
  const [reps, setReps] = useState<number>(value.reps ?? 0)
  const [duration, setDuration] = useState<number>(value.durationSec ?? 0)
  const [distance, setDistance] = useState<number>(value.distanceM ?? 0)

  useEffect(() => {
    const updated: WorkoutSet = {
      ...value,
      weightKg: type === "weight-reps" ? weight : null,
      reps: (type === "weight-reps" || type === "bodyweight-reps") ? reps : null,
      durationSec: (type === "duration" || type === "distance-duration") ? duration : null,
      distanceM: type === "distance-duration" ? distance : null,
    }

    onChange(updated)

  }, [weight, reps, duration, distance])


  function Wheel({
    label,
    value,
    onChange,
    step = 1,
    min = 0,
    max = 999,
    unit,
  }: {
    label: string
    value: number
    onChange: (v: number) => void
    step?: number
    min?: number
    max?: number
    unit?: string
  }) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-sm text-muted-foreground">{label}</span>

        <motion.div
          className={cn(
            "mt-2 h-24 w-20 rounded-xl",
            "bg-muted/40 dark:bg-muted/20",
            "flex flex-col items-center justify-center",
            "border border-border shadow-sm select-none"
          )}
          whileHover={{ scale: 1.03 }}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(Math.min(max, value + step))}
            className="p-1 text-muted-foreground hover:text-purple-500"
          >
            <Plus className="w-4 h-4" />
          </motion.button>

          <motion.div layout className="font-bold text-xl">
            {value}
            {unit && <span className="text-sm ml-1">{unit}</span>}
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(Math.max(min, value - step))}
            className="p-1 text-muted-foreground hover:text-purple-500"
          >
            <Minus className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    )
  }


  const iconMap: Record<ExerciseCategory, any> = {
    "weight-reps": Dumbbell,
    "bodyweight-reps": Dumbbell,
    "duration": Timer,
    "distance-duration": Gauge
  }

  const Icon = iconMap[type]


  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl border p-4 shadow-sm bg-card dark:bg-card/80",
        "flex flex-col gap-4"
      )}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-purple-500 dark:text-purple-300" />
          <span className="font-semibold text-lg">
            Set {value.setIndex + 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onDuplicate && (
            <Button variant="secondary" size="icon" onClick={onDuplicate}>
              <Copy className="w-4 h-4" />
            </Button>
          )}

          {onRemove && (
            <Button variant="destructive" size="icon" onClick={onRemove}>
              X
            </Button>
          )}
        </div>
      </div>


      {/* BODY */}
      <div className="flex items-center justify-center gap-6">

        {(type === "weight-reps" || type === "bodyweight-reps") && (
          <>
            {type === "weight-reps" && (
              <Wheel
                label="Peso"
                value={weight}
                onChange={setWeight}
                step={2.5}
                unit="kg"
              />
            )}

            <Wheel
              label="Reps"
              value={reps}
              onChange={setReps}
              step={1}
            />
          </>
        )}

        {type === "duration" && (
          <Wheel
            label="Duração"
            value={duration}
            onChange={setDuration}
            step={5}
            unit="s"
          />
        )}

        {type === "distance-duration" && (
          <>
            <Wheel
              label="Distância"
              value={distance}
              onChange={setDistance}
              step={10}
              unit="m"
            />

            <Wheel
              label="Duração"
              value={duration}
              onChange={setDuration}
              step={5}
              unit="s"
            />
          </>
        )}
      </div>


      {/* PRESETS */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        <Button
          variant="outline"
          onClick={() => {
            if (type === "weight-reps") setWeight(weight + 2.5)
            if (type === "bodyweight-reps") setReps(reps + 1)
          }}
        >
          + leve
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            if (type === "weight-reps") setWeight(weight + 5)
            if (type === "bodyweight-reps") setReps(reps + 2)
          }}
        >
          + médio
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            if (type === "weight-reps") setWeight(weight + 10)
            if (type === "bodyweight-reps") setReps(reps + 3)
            if (type === "duration") setDuration(duration + 10)
          }}
        >
          + forte
        </Button>
      </div>
    </motion.div>
  )
}
