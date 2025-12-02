"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Copy, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { WorkoutSet, ExerciseCategory } from "@/lib/types"

interface SessionSetCardProps {
  set: WorkoutSet
  type: ExerciseCategory
  onEdit: () => void
  onDuplicate: () => void
  onRemove: () => void
}

export function SessionSetCard({
  set,
  type,
  onEdit,
  onDuplicate,
  onRemove
}: SessionSetCardProps) {

  function renderSummary() {
    switch (type) {
      case "weight-reps":
        return `${set.weightKg}kg × ${set.reps} reps`
      case "bodyweight-reps":
        return `${set.reps} reps`
      case "duration":
        return `${set.durationSec}s`
      case "distance-duration":
        return `${set.distanceM}m • ${set.durationSec}s`
      default:
        return ""
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.96 }}
        className={cn(
          "rounded-xl border p-3 bg-card dark:bg-card/80 shadow-sm",
          "flex items-center justify-between gap-4"
        )}
      >
        <div className="flex-1 cursor-pointer" onClick={onEdit}>
          <div className="font-semibold text-purple-600 dark:text-purple-300">
            Set {set.setIndex + 1}
          </div>
          <div className="text-sm text-muted-foreground">
            {renderSummary()}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="icon" variant="secondary" onClick={onDuplicate}>
            <Copy className="w-4 h-4" />
          </Button>

          <Button size="icon" variant="destructive" onClick={onRemove}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
