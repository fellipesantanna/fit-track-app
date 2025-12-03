import { supabase } from "@/lib/supabase";
import { mapDbRoutine } from "@/lib/mappers/routine";

/* ============================================================
   HELPERS
============================================================ */
function toDbRoutinePayload(routine: any, userId: string) {
  return {
    name: routine.name,
    user_id: userId,
    exercises: routine.exercises.map((e: any) => ({
      exercise_id: e.exerciseId,
      position: e.position,
      suggested_sets: e.suggestedSets ?? null,
      suggested_reps: e.suggestedReps ?? null,
      advanced_technique: e.advancedTechnique ?? "",
    })),
  };
}

/* ============================================================
   API
============================================================ */
export const routinesApi = {
  /* ---------- GET ALL ---------- */
  async getAll() {
    const { data, error } = await supabase
      .from("routines")
      .select(`
        id,
        name,
        created_at,
        user_id,
        routine_exercises (
          id,
          exercise_id,
          position,
          suggested_sets,
          suggested_reps,
          advanced_technique
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(mapDbRoutine);
  },

  /* ---------- GET BY ID ---------- */
  async getById(id: string) {
    const { data, error } = await supabase
      .from("routines")
      .select(`
        id,
        name,
        created_at,
        user_id,
        routine_exercises (
          id,
          exercise_id,
          position,
          suggested_sets,
          suggested_reps,
          advanced_technique
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapDbRoutine(data);
  },

  /* ---------- CREATE ---------- */
  async create(input: any) {
    // 1) Criar rotina
    const { data: routine, error } = await supabase
      .from("routines")
      .insert({
        name: input.name,
        user_id: input.userId,
      })
      .select("*")
      .single();

    if (error) throw error;

    // 2) Criar exercícios da rotina
    if (input.exercises.length > 0) {
      const exercisePayload = input.exercises.map((e: any) => ({
        routine_id: routine.id,
        exercise_id: e.exerciseId,
        position: e.position,
        suggested_sets: e.suggestedSets ?? null,
        suggested_reps: e.suggestedReps ?? null,
        advanced_technique: e.advancedTechnique ?? "",
      }));

      const { error: exError } = await supabase
        .from("routine_exercises")
        .insert(exercisePayload);

      if (exError) throw exError;
    }

    return routinesApi.getById(routine.id);
  },

  /* ---------- UPDATE (FINAL) ---------- */
  async update(id: string, input: any) {
    // Garantir usuário autenticado
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) throw new Error("Usuário não autenticado");

    const payload = toDbRoutinePayload(input, userId);

    // 1) Atualizar nome da rotina
    const { error: updateError } = await supabase
      .from("routines")
      .update({
        name: payload.name,
        user_id: userId,
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // 2) Apagar exercícios antigos
    await supabase.from("routine_exercises").delete().eq("routine_id", id);

    // 3) Recriar exercícios atualizados
    const newItems = payload.exercises.map((e: any) => ({
      routine_id: id,
      exercise_id: e.exercise_id ?? e.exerciseId,
      position: e.position,
      suggested_sets: e.suggested_sets ?? e.suggestedSets ?? null,
      suggested_reps: e.suggested_reps ?? e.suggestedReps ?? null,
      advanced_technique: e.advanced_technique ?? e.advancedTechnique ?? "",
    }));

    const { error: insertError } = await supabase
      .from("routine_exercises")
      .insert(newItems);

    if (insertError) throw insertError;

    // 4) Retornar rotina final
    return await routinesApi.getById(id);
  },

  /* ---------- DELETE ---------- */
  async delete(id: string) {
    const { error } = await supabase.from("routines").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};
