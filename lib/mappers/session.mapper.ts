import { Session } from "../types"

export function mapDbSession(db: any): Session {
  return {
    id: db.id,
    routineId: db.routine_id,
    routineName: db.routine_name,
    startedAt: new Date(db.started_at),
    finishedAt: new Date(db.finished_at),
    exercises: db.session_exercises.map((ex: any) => ({
      id: ex.id,
      exerciseId: ex.exercise_id,
      exerciseName: ex.exercise_name,
      category: ex.category,
      photoUrl: ex.photo_url,
      position: ex.position,
      sets: ex.sets.map((s: any) => ({
        id: s.id,
        setIndex: s.set_index,
        reps: s.reps ?? undefined,
        weightKg: s.weight_kg ?? undefined,
        durationSec: s.duration_sec ?? undefined,
        distanceM: s.distance_m ?? undefined,
      }))
    }))
  }
}
