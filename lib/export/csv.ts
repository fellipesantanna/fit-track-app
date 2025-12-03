export function exportSessionsToCSV(sessions: any[]) {
  let rows: string[] = []

  rows.push([
    "sessionId",
    "routineName",
    "startedAt",
    "finishedAt",
    "exerciseName",
    "category",
    "setIndex",
    "reps",
    "weightKg",
    "durationSec",
    "distanceM"
  ].join(","))

  for (const s of sessions) {
    for (const ex of s.exercises) {
      for (const set of ex.sets) {
        rows.push([
          s.id,
          s.routineName,
          s.startedAt.toISOString(),
          s.finishedAt.toISOString(),
          ex.exerciseName,
          ex.category,
          set.setIndex,
          set.reps ?? "",
          set.weightKg ?? "",
          set.durationSec ?? "",
          set.distanceM ?? ""
        ].join(","))
      }
    }
  }

  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", "treinos.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
