"use client"

import { useState } from "react"
import { Exercise } from "@/lib/types"
import { CreateExerciseModal } from "./CreateExerciseModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  exercises: Exercise[]
  selected: string[]
  onToggle: (exerciseId: string) => void
}

export function ExerciseSelector({ exercises, selected, onToggle }: Props) {
  const [query, setQuery] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [localExercises, setLocalExercises] = useState<Exercise[]>(exercises)

  const categories = [
    { key: "all", label: "Todos" },
    { key: "peso_reps", label: "Peso + Reps" },
    { key: "corpo_livre", label: "Corpo Livre" },
    { key: "duracao", label: "Duração" },
    { key: "distancia_duracao", label: "Distância + Duração" },
  ]

  const [activeCategory, setActiveCategory] = useState("all")

  // 🔍 FILTRAR LISTA
  const filtered = localExercises.filter(ex => {
    const matchesQuery = ex.name.toLowerCase().includes(query.toLowerCase())
    const matchesCategory =
      activeCategory === "all" || ex.category === activeCategory
    return matchesQuery && matchesCategory
  })

  // 📌 Quando cria exercício → adiciona + seleciona + fecha modal
  function handleCreated(newExercise: Exercise) {
    setLocalExercises(prev => [...prev, newExercise])
    onToggle(newExercise.id)
    setCreateOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* 🔎 Busca */}
      <Input
        placeholder="Buscar exercício..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Categorias */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => setActiveCategory(c.key)}
            className={`px-3 py-1 rounded-full border text-sm ${
              activeCategory === c.key
                ? "bg-purple-600 text-white border-purple-600"
                : "border-muted-foreground text-muted-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* LISTA DE EXERCÍCIOS */}
      <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-2">
        {filtered.map((ex) => {
          const isSelected = selected.includes(ex.id)

          return (
            <button
              key={ex.id}
              onClick={() => onToggle(ex.id)}
              className={`flex justify-between items-center p-3 rounded-lg border transition ${
                isSelected ? "bg-purple-600 text-white border-purple-600" : "bg-card"
              }`}
            >
              {ex.name}
            </button>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-3">
            Nenhum exercício encontrado.
          </p>
        )}
      </div>

      {/* BOTÃO CRIAR EXERCÍCIO */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setCreateOpen(true)}
      >
        Criar novo exercício
      </Button>

      {/* MODAL */}
      {createOpen && (
        <CreateExerciseModal
          onClose={() => setCreateOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}