"use client"

// lib/exercises.ts
import { supabase } from "@/lib/supabaseClient"
import type { Exercise } from "@/lib/types"

export type ExerciseCategory = Exercise["category"]

interface CreateExerciseInput {
  name: string
  category: ExerciseCategory
  imageUrl?: string | null
}

interface UpdateExerciseInput {
  id: string
  name?: string
  category?: ExerciseCategory
  imageUrl?: string | null
  isDeleted?: boolean
}

export const exercisesApi = {
  async getAll(): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("is_deleted", false)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Erro ao buscar exercícios:", error)
      throw error
    }

    // adapta o shape pro teu type se precisar
    return (data || []) as Exercise[]
  },

  async create(input: CreateExerciseInput): Promise<Exercise> {
    const { data, error } = await supabase
      .from("exercises")
      .insert({
        name: input.name.trim(),
        category: input.category,
        image_url: input.imageUrl ?? null,
        // user_id vem de default auth.uid() (via SQL abaixo)
      })
      .select("*")
      .single()

    if (error) {
      console.error("Erro ao criar exercício:", error)
      throw error
    }

    return data as Exercise
  },

  async update(input: UpdateExerciseInput): Promise<Exercise> {
    const { id, ...changes } = input

    const payload: any = {}
    if (changes.name !== undefined) payload.name = changes.name
    if (changes.category !== undefined) payload.category = changes.category
    if (changes.imageUrl !== undefined) payload.image_url = changes.imageUrl
    if (changes.isDeleted !== undefined) payload.is_deleted = changes.isDeleted

    const { data, error } = await supabase
      .from("exercises")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single()

    if (error) {
      console.error("Erro ao atualizar exercício:", error)
      throw error
    }

    return data as Exercise
  },

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from("exercises")
      .update({ is_deleted: true })
      .eq("id", id)

    if (error) {
      console.error("Erro ao apagar exercício:", error)
      throw error
    }
  },

  async hardDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from("exercises")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Erro ao deletar exercício:", error)
      throw error
    }
  },
}
