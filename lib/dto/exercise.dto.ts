export interface CreateExerciseDto {
  name: string
  category: string
  suggestedReps?: number | null
  suggestedWeight?: number | null
  suggestedTime?: number | null
  suggestedDistance?: number | null
}

export interface UpdateExerciseDto {
  name?: string
  category?: string
  suggestedReps?: number | null
  suggestedWeight?: number | null
  suggestedTime?: number | null
  suggestedDistance?: number | null
}
