import { supabase } from "@/lib/supabase";
import { mapDbExercise, toDbExercisePayload } from "@/lib/mappers/exercise";

export const exercisesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data.map(mapDbExercise);
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapDbExercise(data);
  },

  async create(dto: any, userId: string) {
    const payload = toDbExercisePayload({ ...dto, userId });

    const { data, error } = await supabase
      .from("exercises")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return mapDbExercise(data);
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("exercises")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }
};
