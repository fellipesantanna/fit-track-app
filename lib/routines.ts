import type { Routine } from "./types"
import { storage } from "./storage"

export const routinesApi = {
  // Get all routines
  getRoutines(): Routine[] {
    return storage.getRoutines()
  },

  // Get routine by ID
  getRoutine(id: string): Routine | null {
    return storage.getRoutineById(id)
  },

  // Create new routine
  createRoutine(routine: Omit<Routine, "id" | "createdAt">): Routine {
    return storage.createRoutine(routine)
  },

  // Update routine
  updateRoutine(id: string, updates: Partial<Routine>): Routine | null {
    return storage.updateRoutine(id, updates)
  },

  // Delete routine
  deleteRoutine(id: string): boolean {
    return storage.deleteRoutine(id)
  },
}
