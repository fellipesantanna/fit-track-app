"use client"

import { useEffect, useState } from "react"
import { sessionsApi } from "@/lib/api/sessions"
import { WorkoutSession } from "@/lib/types"

export default function HistoricoPage() {
  const [list, setList] = useState<WorkoutSession[]>([])

  async function load() {
    const sessions = await sessionsApi.getAll()
    // getById for each? Yes — because getAll returns DB raw rows
    const detailed = []
    for (const s of sessions) {
      detailed.push(await sessionsApi.getById(s.id))
    }
    setList(detailed)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Histórico de Sessões</h1>

      <ul>
        {list.map((s) => (
          <li key={s.id}>
            {s.createdAt.toLocaleString()} — {s.exercises.length} exercícios
          </li>
        ))}
      </ul>
    </div>
  )
}
