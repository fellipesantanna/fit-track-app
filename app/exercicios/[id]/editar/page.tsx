"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { exercisesApi } from "@/lib/api/exercises"
import { Exercise, ExerciseCategory } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const CATEGORY_OPTIONS: { id: ExerciseCategory; label: string }[] = [
  { id: "weight-reps", label: "Peso + Repetições" },
  { id: "bodyweight-reps", label: "Peso Corporal" },
  { id: "duration", label: "Duração" },
  { id: "distance-duration", label: "Distância + Duração" },
]

export default function EditExercisePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [name, setName] = useState("")
  const [category, setCategory] = useState<ExerciseCategory>("weight-reps")

  const [photo, setPhoto] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  /** =============================
   * Carregar dados
   ============================== */
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const ex = await exercisesApi.getById(id)
        setExercise(ex)
        setName(ex.name)
        setCategory(ex.category)
        setPhoto(ex.photoUrl ?? null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  /** =============================
   * Upload de imagem
   ============================== */
  async function uploadPhoto(e: any) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const ext = file.name.split(".").pop()
      const path = `exercises/${id}.${ext}`

      // upload
      const { error } = await supabase.storage
        .from("exercises")
        .upload(path, file, {
          upsert: true,
        })

      if (error) throw error

      // pegar URL pública
      const { data: pub } = supabase.storage
        .from("exercises")
        .getPublicUrl(path)

      setPhoto(pub.publicUrl)
    } catch (err) {
      console.error(err)
      alert("Erro ao enviar imagem.")
    } finally {
      setUploading(false)
    }
  }

  /** =============================
   * Salvar exercício
   ============================== */
  async function save() {
    if (name.trim().length < 2) {
      alert("Nome muito curto.")
      return
    }

    setSaving(true)
    try {
      await exercisesApi.update(id, {
        name,
        category,
        photoUrl: photo
      })

      router.push("/exercicios")
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar.")
    } finally {
      setSaving(false)
    }
  }

  /** =============================
   * Renderização
   ============================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!exercise) return <div>Exercício não encontrado.</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
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
          <h1 className="text-2xl font-bold">Editar exercício</h1>
          <p className="text-muted-foreground text-sm">
            Ajuste informações e foto
          </p>
        </div>
      </div>

      <Separator />

      {/* FOTO */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Foto do exercício</label>

        <div className="rounded-xl border p-4 bg-muted/20 dark:bg-muted/10 flex flex-col gap-3 items-center">
          {photo ? (
            <Image
              src={photo}
              alt="exercício"
              width={300}
              height={200}
              className="rounded-md object-cover shadow"
            />
          ) : (
            <div className="h-40 w-full rounded-md bg-muted flex items-center justify-center text-muted-foreground">
              Sem foto
            </div>
          )}

          <Input
            type="file"
            accept="image/*"
            onChange={uploadPhoto}
            disabled={uploading}
          />

          {uploading && (
            <div className="text-sm text-purple-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando imagem...
            </div>
          )}
        </div>
      </div>

      {/* NOME */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Nome do exercício</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Supino Reto"
        />
      </div>

      {/* CATEGORIA */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Categoria</label>

        <div className="grid grid-cols-2 gap-3">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                "p-3 rounded-xl border text-left transition-colors",
                category === cat.id
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-card dark:bg-card/80 hover:bg-muted/30"
              )}
            >
              <div className="font-semibold">{cat.label}</div>
              <div className="text-muted-foreground text-xs">{cat.id}</div>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* BOTÃO DE SALVAR */}
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
        Salvar alterações
      </Button>

    </motion.div>
  )
}
