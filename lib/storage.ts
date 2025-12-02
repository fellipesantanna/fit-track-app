"use client"

import { supabase } from "./supabaseClient"
import type { Exercise, Routine, WorkoutSession } from "./types"
import { auth } from "./auth"

const EXERCISES_KEY = "fitness-tracker-exercises"
const ROUTINES_KEY = "fitness-tracker-routines"
const SESSIONS_KEY = "fitness-tracker-sessions"

export const storage = {
  getCurrentUserId(): string {
    const userId = auth.getCurrentUserId()
    if (!userId) throw new Error("User not authenticated")
    return userId
  },

  // Exercises (catálogo pessoal) - agora vindo do Supabase
  async getExercises(): Promise<Exercise[]> {
    const userId = this.getCurrentUserId()

    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("user_id", userId)
      .eq("is_deleted", false) // só exercícios ativos
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Erro ao buscar exercícios no Supabase:", error)
      return []
    }

    const exercises: Exercise[] = (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      photoUrl: row.image_url ?? undefined,
      userId,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    }))

    return exercises
  },

  async saveExercise(
    exercise: Omit<Exercise, "id" | "createdAt" | "userId">
  ): Promise<Exercise | null> {
    const userId = this.getCurrentUserId()

    const newExercise: Exercise = {
      ...exercise,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      userId,
    }

    const { error } = await supabase.from("exercises").insert({
      id: newExercise.id,
      user_id: userId,
      name: newExercise.name,
      category: newExercise.category,
      image_url: newExercise.photoUrl ?? null,
      is_deleted: false,
      created_at: newExercise.createdAt.toISOString(),
    })

    if (error) {
      console.error("Erro ao salvar exercício no Supabase:", error)
      return null
    }

    return newExercise
  },

  async updateExercise(id: string, updates: Partial<Exercise>): Promise<void> {
    const userId = this.getCurrentUserId()

    const payload: any = {}
    if (typeof updates.name === "string") payload.name = updates.name
    if (typeof updates.category === "string") payload.category = updates.category
    if (typeof updates.photoUrl === "string") payload.image_url = updates.photoUrl

    const { error } = await supabase
      .from("exercises")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Erro ao atualizar exercício no Supabase:", error)
    }
  },

  async deleteExercise(id: string): Promise<void> {
    const userId = this.getCurrentUserId()

    const { error } = await supabase
      .from("exercises")
      .update({ is_deleted: true })
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Erro ao excluir exercício no Supabase:", error)
    }
  },

// Routines (templates) - agora vindo do Supabase
  async getRoutines(): Promise<Routine[]> {
    const userId = this.getCurrentUserId()

    const { data, error } = await supabase
      .from("routines")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Erro ao buscar rotinas no Supabase:", error)
      return []
    }

    // Aqui assumo que sua tabela "routines" tem pelo menos:
    // id (uuid), user_id (uuid), name (text), created_at (timestamp)
    // Se o nome da coluna for "title" em vez de "name", é só trocar.
    const routines: Routine[] = (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name ?? row.title ?? "",
      userId,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      // se seu tipo Routine tiver mais campos, você pode preenchê-los aqui
      // por enquanto deixamos exerciseIds vazio – depois ligamos com routine_exercises
      exerciseIds: row.exercise_ids ?? [],
    }))

    return routines
  },

async saveRoutine(
    routine: Omit<Routine, "id" | "created_at" | "user_id">
  ): Promise<Routine | null> {
    const userId = this.getCurrentUserId()

    const newRoutine: Routine = {
      ...routine,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      userId,
    }

    const { error } = await supabase.from("routines").insert({
      id: newRoutine.id,
      user_id: userId,
      name: newRoutine.name,       // ou "title" se essa for sua coluna
      created_at: newRoutine.createdAt.toISOString(),
      // se você tiver criado uma coluna JSON (ex.: "config"),
      // pode salvar a rotina inteira nela:
      // config: newRoutine,
    })

    if (error) {
      console.error("Erro ao salvar rotina no Supabase:", error)
      return null
    }

    return newRoutine
  },

  async updateRoutine(id: string, updates: Partial<Routine>): Promise<void> {
    const userId = this.getCurrentUserId()

    const payload: any = {}
    if (typeof updates.name === "string") {
      payload.name = updates.name
    }
    if (updates.exerciseConfig) {
      // se você tiver criado a coluna JSON "exercise_config" na tabela routines
      payload.exercise_config = updates.exerciseConfig
    }
    // opcional: se tiver coluna updated_at
    payload.updated_at = new Date().toISOString()

    const { error } = await supabase
      .from("routines")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Erro ao atualizar rotina no Supabase:", error)
    }
  },

  async deleteRoutine(id: string): Promise<void> {
    const userId = this.getCurrentUserId()

    const { error } = await supabase
      .from("routines")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Erro ao excluir rotina no Supabase:", error)
    }
  },

  // Sessions (execuções de treino) - agora vindo do Supabase
  async getSessions(): Promise<WorkoutSession[]> {
    const userId = this.getCurrentUserId()

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .order("session_date", { ascending: false })

    if (error) {
      console.error("Erro ao buscar sessões no Supabase:", error)
      return []
    }

    const sessions: WorkoutSession[] = (data ?? []).map((row: any) => {
      const base: WorkoutSession = row.payload

      return {
        ...base,
        id: row.id || base.id,
        userId,
        date: row.session_date ? new Date(row.session_date) : new Date(base.date),
      }
    })

    return sessions
  },

  async saveSession(
    session: Omit<WorkoutSession, "id" | "userId">
  ): Promise<WorkoutSession | null> {
    const userId = this.getCurrentUserId()

    const newSession: WorkoutSession = {
      ...session,
      id: crypto.randomUUID(),
      userId,
    }

    const sessionDate =
      newSession.date instanceof Date ? newSession.date.toISOString() : new Date().toISOString()

    const { error } = await supabase.from("sessions").insert({
      id: newSession.id,
      user_id: userId,
      routine_id: (newSession as any).routineId ?? null,
      session_date: sessionDate,
      notes: (newSession as any).notes ?? null,
      payload: newSession,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Erro ao salvar sessão no Supabase:", error)
      return null
    }

    return newSession
  },

  async updateSession(id: string, updates: Partial<WorkoutSession>): Promise<void> {
    const userId = this.getCurrentUserId()

    // Buscar sessão atual
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Erro ao carregar sessão para atualização:", error)
      return
    }

    const current: WorkoutSession = data.payload
    const updated: WorkoutSession = {
      ...current,
      ...updates,
    }

    const sessionDate =
      updated.date instanceof Date ? updated.date.toISOString() : new Date().toISOString()

    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        routine_id: (updated as any).routineId ?? null,
        session_date: sessionDate,
        notes: (updated as any).notes ?? null,
        payload: updated,
      })
      .eq("id", id)
      .eq("user_id", userId)

    if (updateError) {
      console.error("Erro ao atualizar sessão no Supabase:", updateError)
    }
  },

  async deleteSession(id: string): Promise<void> {
    const userId = this.getCurrentUserId()

    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Erro ao excluir sessão no Supabase:", error)
    }
  },

  async getLastSessionForRoutine(routineId: string): Promise<WorkoutSession | null> {
    const userId = this.getCurrentUserId()

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("routine_id", routineId)
      .order("session_date", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Erro ao buscar última sessão da rotina no Supabase:", error)
      return null
    }

    if (!data || data.length === 0) return null

    const row = data[0]
    const base: WorkoutSession = row.payload

    return {
      ...base,
      id: row.id || base.id,
      userId,
      date: row.session_date ? new Date(row.session_date) : new Date(base.date),
    }
  },
}
