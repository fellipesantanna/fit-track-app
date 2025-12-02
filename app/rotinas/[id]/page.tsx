"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { routinesApi } from "@/lib/api/routines"
import { exercisesApi } from "@/lib/api/exercise"
import { Routine, Exercise, RoutineExercise } from "@/lib/types"
import { RoutineExerciseEditor } from "@/components/routines/RoutineExerciseEditor"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

export default function EditRoutinePage() {
  const params = useParams()
  const router = useRouter()
  const routineId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [routine, setRoutine] = useState<Routine | null>(null)
  const [allExercises, setAllExercises] = useState<Exercise[]>([])
  const [exercises, setExercises] = useState<RoutineExercise[]>([])
  const [name, setName] = useState("")

  async function load() {
    setLoading(true)
    try {
      const [r, ex] = await Promise.all([
        routinesApi.getById(routineId),
        exercisesApi.getAll()
      ])

      setRoutine(r)
      setAllExercises(ex)
      setExercises(r.exercises)
      setName(r.name)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function save() {
    setSaving(true)
    try {
      await routinesApi.update(routineId, {
        name,
        exercises: exercises.map(e => ({
          exerciseId: e.exerciseId,
          position: e.position,
          suggestedSets: e.suggestedSets,
          suggestedReps: e.suggestedReps,
          advancedTechnique: e.advancedTechnique
        }))
      })

      router.push("/rotinas")
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!confirm("Apagar esta rotina?")) return
    await routinesApi.delete(routineId)
    router.push("/rotinas")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!routine) return <div>Rotina não encontrada.</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-3xl mx-auto p-6 flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold mb-1">Editar Rotina</h1>
        <p className="text-muted-foreground">Ajuste os exercícios, ordem e sugestões.</p>
      </div>

      <Separator />

      {/* Nome da rotina */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Nome da rotina</label>
        <input
          className="border rounded-md p-2 bg-background dark:bg-background"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ex: Treino A — Superiores"
        />
      </div>

      {/* Editor avançado */}
      <RoutineExerciseEditor
        availableExercises={allExercises}
        initial={exercises}
        onChange={setExercises}
      />

      <Separator />

      {/* Ações */}
      <div className="flex justify-between mt-6">
        
        {/* Remover */}
        <Button
          variant="destructive"
          onClick={remove}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Apagar rotina
        </Button>

        {/* Salvar */}
        <Button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Salvar alterações
        </Button>
      </div>
    </motion.div>
  )
}
