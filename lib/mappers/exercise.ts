import { Exercise } from "../types"

export function mapDbExercise(row: any): Exercise {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    createdAt: new Date(row.created_at),
    userId: row.user_id,

    suggestedReps: row.suggested_reps,
    suggestedWeight: row.suggested_weight,
    suggestedTime: row.suggested_time,
    suggestedDistance: row.suggested_distance
  }
}
