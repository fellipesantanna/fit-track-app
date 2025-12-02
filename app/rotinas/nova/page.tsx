"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { exercisesApi } from "@/lib/api/exercise"
import { routinesApi } from "@/lib/api/routines"
import { Exercise, RoutineExercise } from "@/lib/types"
import { RoutineExerciseEditor } from "@/components/routines/RoutineExerciseEditor"
import { Button } from "@/components/ui/button"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

export default function NovaRotinaPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [routineName, setRoutineName] = useState("")
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([])

  /** ============ CARREGAR EXERCÍCIOS ============ */
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const ex = await exercisesApi.getAll()
        setExercises(ex)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  /** ============ SALVAR ROTINA ============ */
  async function save() {
    if (routineName.trim().length < 3) {
      alert("O nome da rotina precisa ter pelo menos 3 caracteres.")
      return
    }

    if (routineExercises.length === 0) {
      alert("Adicione pelo menos um exercício.")
      return
    }

    setSaving(true)

    try {
      await routinesApi.create({
        name: routineName,
        exercises: routineExercises.map((e) => ({
          exerciseId: e.exerciseId,
          position: e.position,
          suggestedSets: e.suggestedSets,
          suggestedReps: e.suggestedReps,
          advancedTechnique: e.advancedTechnique,
        }))
      })

      router.push("/rotinas")
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar rotina.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-3xl mx-auto p-6 flex flex-col gap-6"
    >

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Criar nova rotina</h1>
          <p className="text-muted-foreground text-sm">
            Monte um treino premium com drag & drop e presets
          </p>
        </div>
      </div>

      <Separator />

      {/* FORM NOME */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Nome da rotina</label>
        <input
          className="border rounded-md p-2 bg-background dark:bg-background"
          placeholder="Ex: Treino A — Peito e Tríceps"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
        />
      </div>

      {/* EDITOR PREMIUM */}
      <RoutineExerciseEditor
        availableExercises={exercises}
        initial={routineExercises}
        onChange={setRoutineExercises}
      />

      <Separator />

      {/* BOTÃO SALVAR */}
      <Button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 justify-center text-lg py-6 bg-purple-600 hover:bg-purple-700"
      >
        {saving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
        Salvar rotina
      </Button>

    </motion.div>
  )
}
