// lib/dto/routine.dto.ts

export interface RoutineExerciseInput {
  id: string
  exerciseId: string
  position: number
  suggestedSets?: number | null
  suggestedReps?: number | null
  advancedTechnique?: string | null
}

export interface CreateRoutineDto {
  name: string
  exercises: RoutineExerciseInput[]
}

export interface UpdateRoutineDto {
  name?: string
  exercises?: RoutineExerciseInput[]
}
