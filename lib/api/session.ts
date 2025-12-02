import { supabase } from "@/lib/supabase"
import { CreateSessionDto } from "@/lib/types"
import { mapDbSession } from "@/lib/mappers/session"

export const sessionsApi = {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("sessions")
      .select(`
        *,
        session_exercises (
          *,
          sets(*)
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error

    return mapDbSession(data)
  },

  async create(dto: CreateSessionDto, userId: string) {
    const { data: session, error } = await supabase
      .from("sessions")
      .insert({
        routine_id: dto.routineId,
        routine_name: dto.routineName,
        started_at: dto.startedAt.toISOString(),
        finished_at: dto.finishedAt.toISOString(),
        user_id: userId,
      })
      .select()
      .single()

    if (error) throw error

    for (const ex of dto.exercises) {
      const { data: dbEx, error: exErr } = await supabase
        .from("session_exercises")
        .insert({
          session_id: session.id,
          exercise_id: ex.exerciseId,
          position: ex.position,
        })
        .select()
        .single()

      if (exErr) throw exErr

      for (const set of ex.sets) {
        const { error: setErr } = await supabase
          .from("sets")
          .insert({
            session_exercise_id: dbEx.id,
            set_index: set.setIndex,
            reps: set.reps ?? null,
            weight_kg: set.weightKg ?? null,
            duration_sec: set.durationSec ?? null,
            distance_m: set.distanceM ?? null,
          })

        if (setErr) throw setErr
      }
    }

    return session.id
  }
}
