import type { Exercise } from "./types"
import { storage } from "./storage"

export const exercisesApi = {
  // Get all exercises
  getExercises(): Exercise[] {
    return storage.getExercises()
  },

  // Get exercise by ID
  getExercise(id: string): Exercise | null {
    return storage.getExerciseById(id)
  },

  // Create new exercise
  createExercise(exercise: Omit<Exercise, "id" | "createdAt">): Exercise {
    return storage.createExercise(exercise)
  },

  // Update exercise
  updateExercise(id: string, updates: Partial<Exercise>): Exercise | null {
    return storage.updateExercise(id, updates)
  },

  // Delete exercise
  deleteExercise(id: string): boolean {
    return storage.deleteExercise(id)
  },

  // Get exercises by category
  getExercisesByCategory(category: string): Exercise[] {
    return storage.getExercises().filter((ex) => ex.category === category)
  },
}
