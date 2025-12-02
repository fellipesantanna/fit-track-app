import type { ExerciseCategory } from "@/lib/types"

export const categoryLabels: Record<ExerciseCategory, string> = {
  "weight-reps": "Peso & Repetições",
  "bodyweight-reps": "Repetições de Peso Corporal",
  duration: "Duração",
  "distance-duration": "Distância & Duração",
}

export const categoryDescriptions: Record<ExerciseCategory, string> = {
  "weight-reps": "Ex: supino, agachamento, desenvolvimento",
  "bodyweight-reps": "Ex: abdominais, flexões, barras",
  duration: "Ex: prancha, alongamentos, yoga",
  "distance-duration": "Ex: correr, ciclismo, remo",
}
