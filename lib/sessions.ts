"use client"

import { supabase } from "./supabaseClient"
import type { WorkoutSession, SessionExercise, Set } from "@/lib/types"

export const sessionsApi = {
  async getAll(): Promise<WorkoutSession[]> {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("sessionsApi.getAll error:", error)
      return []
    }

    return data as WorkoutSession[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("sessions")
      .select(`
        *,
        session_exercises (
          id,
          exercise_id,
          position,
          advanced_technique,
          notes,
          sets (
            id,
            set_index,
            weight_kg,
            reps,
            duration_sec,
            distance_m
          )
        )
      `)
      .eq("id", id)
      .single()

    if (error) return null
    return data
  },

  async create(payload: WorkoutSession) {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error("Not authenticated")

    const { data: session, error } = await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
        routine_id: payload.routineId ?? null,
        routine_name: payload.routineName ?? null,
        session_date: payload.date,
        payload,
      })
      .select()
      .single()

    if (error) throw error

    return session
  },

  async delete(id: string) {
    const { error } = await supabase.from("sessions").delete().eq("id", id)
    if (error) throw error
  },
}
