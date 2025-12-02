// lib/dto/exercise.dto.ts

export interface CreateExerciseDto {
  name: string
  category: string
  photoUrl?: string | null
}

export interface UpdateExerciseDto {
  name?: string
  category?: string
  photoUrl?: string | null
}
