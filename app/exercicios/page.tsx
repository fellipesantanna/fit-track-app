"use client"

import { useEffect, useState } from "react"
import { exercisesApi } from "@/lib/api/exercise"
import { Exercise } from "@/lib/types"

export default function ExercisesPage() {
  const [list, setList] = useState<Exercise[]>([])
  const [name, setName] = useState("")
  const [category, setCategory] = useState("weight-reps")

  async function load() {
    const data = await exercisesApi.getAll()
    setList(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function create() {
    await exercisesApi.create({
      name,
      category,
      photoUrl: null
    })
    setName("")
    load()
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Exercícios</h1>

      <div>
        <input
          placeholder="Nome do exercício"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="weight-reps">Peso + Reps</option>
          <option value="bodyweight-reps">Bodyweight</option>
          <option value="duration">Duração</option>
          <option value="distance-duration">Distância + Tempo</option>
        </select>

        <button onClick={create}>Adicionar</button>
      </div>

      <ul>
        {list.map((e) => (
          <li key={e.id}>
            {e.name} — {e.category}
            <button onClick={() => exercisesApi.delete(e.id).then(load)}>
              apagar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
