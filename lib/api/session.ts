import { supabase } from "../supabase"
import { CreateSessionDto } from "../types"
import { mapDbSession } from "../mappers/session"

export const sessionsApi = {
  async getAll() {
    const user = (await supabase.auth.getUser()).data.user

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("sessions")
      .select(`
        *,
        session_exercises(
          *,
          sets(*)
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error

    return mapDbSession(data)
  },

  async create(dto: CreateSessionDto) {
    const user = (await supabase.auth.getUser()).data.user

    // 1) Criar sessão
    const { data: session, error } = await supabase
      .from("sessions")
      .insert({
        routine_id: dto.routineId,
        routine_name: dto.routineName,
        started_at: dto.startedAt.toISOString(),
        finished_at: dto.finishedAt.toISOString(),
        user_id: user!.id,
      })
      .select()
      .single()

    if (error) throw error

    // 2) Inserir exercícios
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

      // 3) Inserir sets
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
