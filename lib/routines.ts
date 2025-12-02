"use client"

import { supabase } from "./supabaseClient"
import type { Routine } from "@/lib/types"

export const routinesApi = {
  async getAll(): Promise<Routine[]> {
    const { data, error } = await supabase
      .from("routines")
      .select(`
        *,
        routine_exercises (
          exercise_id,
          position,
          suggested_sets,
          suggested_reps,
          advanced_technique
        )
      `)
      .eq("is_deleted", false)
      .order("created_at")

    if (error) {
      console.error("routinesApi.getAll error:", error)
      return []
    }

    return data as Routine[]
  },

  async getById(id: string): Promise<Routine | null> {
    const { data, error } = await supabase
      .from("routines")
      .select(`
        *,
        routine_exercises (
          exercise_id,
          position,
          suggested_sets,
          suggested_reps,
          advanced_technique
        )
      `)
      .eq("id", id)
      .single()

    if (error) return null
    return data as Routine
  },

  async create(name: string, exercises: any[]) {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error("Not authenticated")

    const { data: routine, error } = await supabase
      .from("routines")
      .insert({
        name,
        user_id: user.id,
        is_deleted: false,
      })
      .select()
      .single()

    if (error) throw error

    for (const ex of exercises) {
      await supabase.from("routine_exercises").insert({
        routine_id: routine.id,
        exercise_id: ex.exerciseId,
        position: ex.position,
        suggested_sets: ex.suggestedSets ?? null,
        suggested_reps: ex.suggestedReps ?? null,
        advanced_technique: ex.advancedTechnique ?? null,
      })
    }

    return routine
  },

  async update(id: string, name: string, exercises: any[]) {
    const { error: rErr } = await supabase
      .from("routines")
      .update({ name })
      .eq("id", id)

    if (rErr) throw rErr

    await supabase.from("routine_exercises").delete().eq("routine_id", id)

    for (const ex of exercises) {
      await supabase.from("routine_exercises").insert({
        routine_id: id,
        exercise_id: ex.exerciseId,
        position: ex.position,
        suggested_sets: ex.suggestedSets ?? null,
        suggested_reps: ex.suggestedReps ?? null,
        advanced_technique: ex.advancedTechnique ?? null,
      })
    }
  },

  async softDelete(id: string) {
    await supabase.from("routines").update({ is_deleted: true }).eq("id", id)
  },
}
