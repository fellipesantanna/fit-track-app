"use client"

import { useState, useMemo } from "react"
import { Exercise } from "@/lib/types"
import { ExerciseCard } from "./ExerciseCard"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExerciseSelectorProps {
  exercises: Exercise[]
  selected: string[]
  onToggle: (id: string) => void
}

const categories = [
  { id: "all", label: "Todos" },
  { id: "weight-reps", label: "Peso + Reps" },
  { id: "bodyweight-reps", label: "Corpo Livre" },
  { id: "duration", label: "Duração" },
  { id: "distance-duration", label: "Distância + Duração" },
]

export function ExerciseSelector({
  exercises,
  selected,
  onToggle
}: ExerciseSelectorProps) {

  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")

  const filtered = useMemo(() => {
    return exercises.filter(e => {
      if (category !== "all" && e.category !== category) return false
      if (!e.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [exercises, query, category])

  return (
    <div className="flex flex-col gap-4">
      {/* Busca */}
      <Input
        placeholder="Buscar exercício..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Tabs de categoria */}
      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="flex-wrap">
          {categories.map((c) => (
            <TabsTrigger key={c.id} value={c.id}>
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Lista */}
      <div className="grid grid-cols-1 gap-3 mt-2">
        {filtered.map((ex) => (
          <ExerciseCard
            key={ex.id}
            name={ex.name}
            category={ex.category}
            selected={selected.includes(ex.id)}
            onClick={() => onToggle(ex.id)}
          />
        ))}
      </div>
    </div>
  )
}
