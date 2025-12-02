import { storage } from "./storage"

export function exportSessionsToCSV(): string {
  const sessions = await sessionsApi.getAll()
  const exercises = await exercisesApi.getAll()

  // Criar mapa de exercícios para lookup rápido
  const exerciseMap = new Map(exercises.map((e) => [e.id, e]))

  // Headers do CSV
  const headers = [
    "data_sessao",
    "nome_rotina",
    "nome_exercicio",
    "categoria_exercicio",
    "serie",
    "peso_kg",
    "reps",
    "duracao_segundos",
    "horas",
    "minutos",
    "distancia_metros",
    "observacoes",
  ]

  // Criar linhas do CSV
  const rows: string[][] = [headers]

  sessions.forEach((session) => {
    const sessionDate = session.date.toLocaleDateString("pt-BR")
    const routineName = session.routineName || "Treino vazio"

    session.exercises.forEach((sessionExercise) => {
      const exercise = exerciseMap.get(sessionExercise.exerciseId)
      const exerciseName = exercise?.name || "Desconhecido"
      const exerciseCategory = exercise?.category || ""

      sessionExercise.sets.forEach((set, index) => {
        const row: string[] = [sessionDate, routineName, exerciseName, exerciseCategory, String(index + 1)]

        // Peso
        if (set.type === "weight-reps") {
          row.push(String(set.weight || 0))
        } else {
          row.push("")
        }

        // Reps
        if (set.type === "weight-reps" || set.type === "bodyweight-reps") {
          row.push(String(set.reps || 0))
        } else {
          row.push("")
        }

        // Duração em segundos
        if (set.type === "duration" || set.type === "distance-duration") {
          row.push(String(set.duration || 0))
          // Horas e minutos
          const hours = Math.floor((set.duration || 0) / 3600)
          const minutes = Math.floor(((set.duration || 0) % 3600) / 60)
          row.push(String(hours))
          row.push(String(minutes))
        } else {
          row.push("")
          row.push("")
          row.push("")
        }

        // Distância
        if (set.type === "distance-duration") {
          row.push(String(set.distance || 0))
        } else {
          row.push("")
        }

        // Observações
        row.push(sessionExercise.notes || "")

        rows.push(row)
      })
    })
  })

  // Converter para CSV
  return rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
