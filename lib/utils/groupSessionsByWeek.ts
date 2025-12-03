// lib/utils/groupSessionsByWeek.ts

import { Session } from "@/lib/types"

/** ==========================================================
 *  FORMATA DATA (DD/MM)
 *  ========================================================== */
function formatDay(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit"
  })
}

/** ==========================================================
 *  CALCULA INÍCIO (SEGUNDA) E FIM (DOMINGO) DA SEMANA
 *  ========================================================== */
export function getWeekRange(date: Date) {
  const d = new Date(date)
  const day = d.getDay() // 0 = domingo, 1 = segunda...

  // ajustar para segunda como início
  const diffToMonday = day === 0 ? -6 : 1 - day

  const monday = new Date(d)
  monday.setDate(d.getDate() + diffToMonday)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return { monday, sunday }
}

/** ==========================================================
 *  AGRUPA SESSÕES POR SEMANA
 *  ========================================================== */
export function groupSessionsByWeek(sessions: Session[]) {
  const groups: Record<string, Session[]> = {}

  sessions.forEach((s) => {
    const { monday, sunday } = getWeekRange(s.finishedAt)

    const weekKey = `${monday.toISOString()}_${sunday.toISOString()}`

    if (!groups[weekKey]) groups[weekKey] = []
    groups[weekKey].push(s)
  })

  // Converter para lista com metadata formatada
  const result = Object.keys(groups)
    .map((key) => {
      const [monISO, sunISO] = key.split("_")

      const monday = new Date(monISO)
      const sunday = new Date(sunISO)

      return {
        key,
        monday,
        sunday,
        label: `Semana ${formatDay(monday)} — ${formatDay(sunday)}`,
        sessions: groups[key].sort(
          (a, b) => b.finishedAt.getTime() - a.finishedAt.getTime()
        ),
      }
    })
    .sort((a, b) => b.monday.getTime() - a.monday.getTime())

  return result
}
