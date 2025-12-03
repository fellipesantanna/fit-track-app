import { supabase } from "@/lib/supabase"
import { CreateExerciseDto, UpdateExerciseDto } from "@/lib/dto/exercise.dto"
import { mapDbExercise } from "@/lib/mappers/exercise"

export const exercisesApi = {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("user_id", userId)
      .order("created_at")

    if (error) throw error
    return data.map(mapDbExercise)
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return mapDbExercise(data)
  },

  async create(dto: CreateExerciseDto, userId: string) {
    const { data, error } = await supabase
      .from("exercises")
      .insert({
        name: dto.name,
        category: dto.category,
        user_id: userId,

        suggested_reps: dto.suggestedReps,
        suggested_weight: dto.suggestedWeight,
        suggested_time: dto.suggestedTime,
        suggested_distance: dto.suggestedDistance
      })
      .select()
      .single()

    if (error) throw error
    return mapDbExercise(data)
  },

  async update(id: string, dto: UpdateExerciseDto) {
    const { data, error } = await supabase
      .from("exercises")
      .update({
        name: dto.name,
        category: dto.category,

        suggested_reps: dto.suggestedReps,
        suggested_weight: dto.suggestedWeight,
        suggested_time: dto.suggestedTime,
        suggested_distance: dto.suggestedDistance
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return mapDbExercise(data)
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("exercises")
      .delete()
      .eq("id", id)

    if (error) throw error
  },
}
