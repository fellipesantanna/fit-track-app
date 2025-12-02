import { Routine } from "../types"

export function mapDbRoutine(row: any): Routine {
  return {
    id: row.id,
    name: row.name,
    createdAt: new Date(row.created_at),
    userId: row.user_id,
    exercises: row.routine_exercises?.map((re: any) => ({
      id: re.id,
      exerciseId: re.exercise_id,
      position: re.position,
      suggestedSets: re.suggested_sets ?? undefined,
      suggestedReps: re.suggested_reps ?? undefined,
      advancedTechnique: re.advanced_technique ?? undefined,
    })) ?? []
  }
}
