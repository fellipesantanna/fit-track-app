import { supabase } from "@/lib/supabase"
import { mapDbSession } from "@/lib/mappers/session"
import { CreateSessionDto } from "@/lib/types"

export const sessionsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from("sessions")
      .select(`
        id,
        routine_id,
        started_at,
        finished_at,
        session_exercises (
          id,
          exercise_id,
          sets (
            id,
            set_index,
            reps,
            weight_kg,
            duration_sec,
            distance_m
          )
        )
      `)
      .order("started_at", { ascending: false })

    if (error) throw error
    return data.map(mapDbSession)
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("sessions")
      .select(`
        id,
        routine_id,
        started_at,
        finished_at,
        session_exercises (
          id,
          exercise_id,
          sets (
            id,
            set_index,
            reps,
            weight_kg,
            duration_sec,
            distance_m
          )
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return mapDbSession(data)
  },

  async create(input: CreateSessionDto) {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    if (!userId) throw new Error("Usuário não autenticado")

    // 1) Criar sessão
    const { data: session, error: err1 } = await supabase
      .from("sessions")
      .insert({
        user_id: userId,
        routine_id: input.routineId,
        started_at: input.startedAt,
        finished_at: input.finishedAt,
      })
      .select("*")
      .single()

    if (err1) throw err1

    // 2) Criar exercícios da sessão
    for (const ex of input.exercises) {
      const { data: dbEx, error: err2 } = await supabase
        .from("session_exercises")
        .insert({
          session_id: session.id,
          exercise_id: ex.exerciseId,
        })
        .select("*")
        .single()

      if (err2) throw err2

      // 3) Criar sets
      if (ex.sets.length > 0) {
        const setsPayload = ex.sets.map((s, i) => ({
          session_exercise_id: dbEx.id,
          set_index: i,
          reps: s.reps ?? null,
          weight_kg: s.weightKg ?? null,
          duration_sec: s.durationSec ?? null,
          distance_m: s.distanceM ?? null,
        }))

        const { error: err3 } = await supabase
          .from("sets")
          .insert(setsPayload)

        if (err3) throw err3
      }
    }

    return this.getById(session.id)
  },
}
