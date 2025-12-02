"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SessionExerciseCard } from "@/components/session/SessionExerciseCard"
import { Button } from "@/components/ui/button"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { sessionsApi } from "@/lib/api/sessions"
import { routinesApi } from "@/lib/api/routines"
import { Exercise, Routine, SessionExercise, WorkoutSet } from "@/lib/types"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { exercisesApi } from "@/lib/api/exercises"

export default function SessaoPage() {
  const searchParams = useSearchParams()
  const routineId = searchParams.get("id")
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [routine, setRoutine] = useState<Routine | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [sessionExercises, setSessionExercises] = useState<SessionExercise[]>([])

  const [sessionStartTimestamp] = useState(Date.now())

  /** ============================
   *  Carregar dados
   ============================ */
  useEffect(() => {
    if (!routineId) {
      router.push("/rotinas")
      return
    }

    async function load() {
      setLoading(true)
      try {
        const [routineData, allExercises] = await Promise.all([
          routinesApi.getById(routineId),
          exercisesApi.getAll()
        ])

        setRoutine(routineData)
        setExercises(allExercises)

        // Montar state da sessão baseado na rotina
        const prepared: SessionExercise[] = routineData.exercises.map((re, idx) => {
          const ex = allExercises.find(e => e.id === re.exerciseId)

          return {
            id: crypto.randomUUID(),
            exerciseId: re.exerciseId,
            exerciseName: ex?.name ?? "Exercício",
            category: ex?.category ?? "weight-reps",
            photoUrl: ex?.photoUrl ?? null,
            position: idx,
            sets: []
          }
        })

        setSessionExercises(prepared)

      } finally {
        setLoading(false)
      }
    }

    load()
  }, [routineId])


  /** ============================
   *  Atualizar sets de um exercício
   ============================ */
  function updateExerciseSets(exId: string, sets: WorkoutSet[]) {
    setSessionExercises(prev =>
      prev.map(se => se.id === exId ? { ...se, sets } : se)
    )
  }


  /** ============================
   *  Salvar sessão no banco
   ============================ */
  async function saveSession() {
    setSaving(true)

    try {
      await sessionsApi.create({
        routineId: routineId!,
        routineName: routine?.name ?? "Treino",
        startedAt: new Date(sessionStartTimestamp),
        finishedAt: new Date(),
        exercises: sessionExercises.map(se => ({
          exerciseId: se.exerciseId,
          position: se.position,
          sets: se.sets
        }))
      })

      router.push("/historico")
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar sessão.")
    } finally {
      setSaving(false)
    }
  }


  /** ============================
   *  UI
   ============================ */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!routine) return <div>Rotina não encontrada.</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
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

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{routine.name}</h1>
          <p className="text-muted-foreground text-sm">
            Cartões grandes • Editor premium
          </p>
        </div>
      </div>

      <Separator />

      {/* EXERCÍCIOS DA SESSÃO */}
      <div className="flex flex-col gap-6">
        {sessionExercises.map((ex) => (
          <motion.div
            key={ex.id}
            layout
            transition={{ type: "spring", bounce: 0.25 }}
          >
            <SessionExerciseCard
              exercise={{
                id: ex.exerciseId,
                name: ex.exerciseName,
                category: ex.category,
                photoUrl: ex.photoUrl!,
                userId: "",
                createdAt: new Date(),
              }}
              type={ex.category}
              sets={ex.sets}
              onChange={(sets) => updateExerciseSets(ex.id, sets)}
            />
          </motion.div>
        ))}
      </div>

      <Separator />

      {/* BOTÃO SALVAR */}
      <Button
        onClick={saveSession}
        disabled={saving}
        className="flex items-center gap-2 justify-center text-lg py-6 bg-purple-600 hover:bg-purple-700"
      >
        {saving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
        Finalizar Sessão
      </Button>

    </motion.div>
  )
}
