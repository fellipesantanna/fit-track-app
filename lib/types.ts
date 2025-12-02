export type ExerciseCategory =
  | "weight-reps" // Peso & Repetições
  | "bodyweight-reps" // Repetições de Peso Corporal
  | "duration" // Duração
  | "distance-duration" // Distância & Duração

export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  photoUrl?: string
  createdAt: Date
  userId: string
}

export interface WeightRepsSet {
  type: "weight-reps"
  reps: number
  weight: number
}

export interface BodyweightRepsSet {
  type: "bodyweight-reps"
  reps: number
}

export interface DurationSet {
  type: "duration"
  duration: number // em segundos
}

export interface DistanceDurationSet {
  type: "distance-duration"
  duration: number // em segundos (stored internally, but input as hours + minutes)
  distance: number // em metros
}

export type Set = WeightRepsSet | BodyweightRepsSet | DurationSet | DistanceDurationSet

export interface Routine {
  id: string
  name: string
  exerciseIds: string[] // referências aos exercícios
  exerciseConfig?: {
    [exerciseId: string]: {
      suggestedSets?: number
      suggestedReps?: number
      advancedTechnique?: string
      order: number // para drag and drop
    }
  }
  createdAt: Date
  userId: string
}

export interface SessionExercise {
  id: string
  exerciseId: string
  sets: Set[]
  notes?: string
}

export interface WorkoutSession {
  id: string
  date: Date
  routineId?: string // opcional: pode ser treino vazio
  routineName?: string
  exercises: SessionExercise[]
  duration?: number // duração total em minutos
  userId: string
}
