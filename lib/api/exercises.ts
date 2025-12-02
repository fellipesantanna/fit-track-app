import { supabase } from "../supabase"
import { SaveExerciseDto } from "../types"
import { mapDbExercise } from "../mappers/exercise"

export const exercisesApi = {
  async getAll() {
    const user = (await supabase.auth.getUser()).data.user
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("user_id", user!.id)
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

  async create(dto: SaveExerciseDto) {
    const user = (await supabase.auth.getUser()).data.user

    const { data, error } = await supabase
      .from("exercises")
      .insert({
        name: dto.name,
        category: dto.category,
        photo_url: dto.photoUrl ?? null,
        user_id: user!.id
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
