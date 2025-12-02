import { supabase } from "@/lib/supabase"
import { SaveExerciseDto } from "@/lib/types"
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

  async create(dto: SaveExerciseDto, userId: string) {
    const { data, error } = await supabase
      .from("exercises")
      .insert({
        name: dto.name,
        category: dto.category,
        photo_url: dto.photoUrl ?? null,
        user_id: userId
      })
      .select()
      .single()

    if (error) throw error
    return mapDbExercise(data)
  },

  async update(id: string, dto: SaveExerciseDto) {
    const { data, error } = await supabase
      .from("exercises")
      .update({
        name: dto.name,
        category: dto.category,
        photo_url: dto.photoUrl ?? null,
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
