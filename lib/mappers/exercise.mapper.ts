import { Exercise } from "../types"

export function mapDbExercise(row: any): Exercise {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    photoUrl: row.photo_url,
    createdAt: new Date(row.created_at),
    userId: row.user_id
  }
}
