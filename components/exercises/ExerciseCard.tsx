"use client"

import { motion } from "framer-motion"
import { Dumbbell, Timer, Footprints, Gauge } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExerciseCardProps {
  name: string
  category: string
  selected?: boolean
  onClick?: () => void
}

const categoryIcons: Record<string, any> = {
  "weight-reps": Dumbbell,
  "bodyweight-reps": Footprints,
  "duration": Timer,
  "distance-duration": Gauge,
}

export function ExerciseCard({
  name,
  category,
  selected = false,
  onClick
}: ExerciseCardProps) {

  const Icon = categoryIcons[category]

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "rounded-xl border p-4 cursor-pointer transition-colors",
        "flex items-center gap-3 shadow-sm",
        "bg-card hover:bg-muted/40",
        "dark:bg-card dark:hover:bg-muted/20",
        selected && "border-purple-500 dark:border-purple-400"
      )}
      onClick={onClick}
    >
      {/* Ícone */}
      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
        <Icon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
      </div>

      {/* Nome */}
      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        <span className="text-sm text-muted-foreground">
          {category}
        </span>
      </div>
    </motion.div>
  )
}
