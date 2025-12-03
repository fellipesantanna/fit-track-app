import { supabase } from "@/lib/supabase"
import { CreateRoutineDto } from "@/lib/types"
import { mapDbRoutine } from "@/lib/mappers/routine"

export const routinesApi = {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from("routines")
      .select("*, routine_exercises(*)")
      .eq("user_id", userId)
      .order("created_at")

    if (error) throw error
    return data.map(mapDbRoutine)
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("routines")
      .select("*, routine_exercises(*)")
      .eq("id", id)
      .single()

    if (error) throw error
    return mapDbRoutine(data)
  },

  async create(dto: CreateRoutineDto, userId: string) {
    const { data: routine, error } = await supabase
      .from("routines")
      .insert({
        name: dto.name,
        user_id: userId
      })
      .select()
      .single()

    if (error) throw error

    for (const ex of dto.exercises) {
      await supabase.from("routine_exercises").insert({
        routine_id: routine.id,
        exercise_id: ex.exerciseId,
        position: ex.position,
        suggested_sets: ex.suggestedSets,
        suggested_reps: ex.suggestedReps,
        advanced_technique: ex.advancedTechnique,
      })
    }

    return mapDbRoutine({
      ...routine,
      routine_exercises: dto.exercises,
    })
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("routines")
      .delete()
      .eq("id", id)

    if (error) throw error
  }
}