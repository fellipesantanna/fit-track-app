"use client"

import { useState } from "react"
import { exercisesApi } from "@/lib/api/exercise"
import { Exercise } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"

interface Props {
  onClose: () => void
  onCreated: (exercise: Exercise) => void
}

export function CreateExerciseModal({ onClose, onCreated }: Props) {
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [category, setCategory] = useState<Exercise["category"]>("peso_reps")

  // SUGGESTIONS
  const [reps, setReps] = useState<number | "">("")
  const [weight, setWeight] = useState<number | "">("")

  // duração
  const [hours, setHours] = useState<number | "">("")
  const [minutes, setMinutes] = useState<number | "">("")

  // distância
  const [km, setKm] = useState<number | "">("")
  const [meters, setMeters] = useState<number | "">("")

  async function save() {
    if (!name.trim()) return alert("Dê um nome ao exercício.")

    setLoading(true)

    // usuário
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert("Você precisa estar logado.")

    // converter tempo
    const totalMinutes =
      (typeof hours === "number" ? hours : 0) * 60 +
      (typeof minutes === "number" ? minutes : 0)

    // converter distância
    const totalMeters =
      (typeof km === "number" ? km * 1000 : 0) +
      (typeof meters === "number" ? meters : 0)

    const dto = {
      name,
      userId: user.id,
      category,
      photoUrl: photoUrl || null,

      suggestedReps: reps || null,
      suggestedWeight: weight || null,

      suggestedTime: category === "duracao" || category === "distancia_duracao"
        ? totalMinutes || null
        : null,

      suggestedDistance: category === "distancia_duracao"
        ? totalMeters || null
        : null,
    }

    try {
      const created = await exercisesApi.create(dto, user.id)
      onCreated(created)
      onClose()
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar exercício.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur flex justify-center items-center p-4 z-50"
    >
      <div className="bg-card w-full max-w-lg rounded-xl p-6 relative shadow-xl">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Criar exercício</h2>

        <div className="flex flex-col gap-4">

          {/* foto */}
          <Input
            placeholder="URL da foto (opcional)"
            value={photoUrl}
            onChange={e => setPhotoUrl(e.target.value)}
          />

          {/* nome */}
          <Input
            placeholder="Nome do exercício"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          {/* categorias */}
          <div>
            <label className="text-sm text-muted-foreground">Categoria</label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {[
                { key: "peso_reps", label: "Peso + Repetições" },
                { key: "corpo_livre", label: "Corpo Livre" },
                { key: "duracao", label: "Duração" },
                { key: "distancia_duracao", label: "Distância + Duração" },
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key as Exercise["category"])}
                  className={`border p-3 rounded-lg text-left ${
                    category === cat.key ? "border-purple-500 bg-purple-500/10" : ""
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* CAMPOS POR CATEGORIA */}

          {category === "peso_reps" && (
            <>
              <Input
                type="number"
                placeholder="Repetições sugeridas"
                value={reps}
                onChange={e => setReps(Number(e.target.value))}
              />

              <Input
                type="number"
                placeholder="Peso sugerido (kg)"
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
              />
            </>
          )}

          {category === "corpo_livre" && (
            <Input
              type="number"
              placeholder="Repetições sugeridas"
              value={reps}
              onChange={e => setReps(Number(e.target.value))}
            />
          )}

          {category === "duracao" && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Horas"
                value={hours}
                onChange={e => setHours(Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Minutos"
                value={minutes}
                onChange={e => setMinutes(Number(e.target.value))}
              />
            </div>
          )}

          {category === "distancia_duracao" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Km"
                  value={km}
                  onChange={e => setKm(Number(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Metros"
                  value={meters}
                  onChange={e => setMeters(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Horas"
                  value={hours}
                  onChange={e => setHours(Number(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Minutos"
                  value={minutes}
                  onChange={e => setMinutes(Number(e.target.value))}
                />
              </div>
            </>
          )}

          <Button
            disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700"
            onClick={save}
          >
            Salvar exercício
          </Button>

        </div>
      </div>
    </motion.div>
  )
}
