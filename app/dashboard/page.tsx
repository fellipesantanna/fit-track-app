"use client"

import { useEffect, useState } from "react"
import { sessionsApi } from "@/lib/api/sessions"
import { routinesApi } from "@/lib/api/routines"
import { Session } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus, Clock, BarChart3, Dumbbell } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { SkeletonCard } from "@/components/common/SkeletonCard"
import { PageHeader } from "@/components/common/PageHeader"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([])
  const [routinesCount, setRoutinesCount] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const [sessionsRes, routinesRes] = await Promise.all([
        sessionsApi.getAll(),
        routinesApi.getAll()
      ])

      setSessions(sessionsRes)
      setRoutinesCount(routinesRes.length)

      setLoading(false)
    }

    load()
  }, [])

  const lastSessions = sessions.slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-10">

      {/* HEADER */}
      <PageHeader
        title="Dashboard"
        subtitle="Resumo das suas atividades recentes"
        icon={BarChart3}
        className="mb-2"
      />

      {/* CARDS RESUMO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Rotinas"
          value={routinesCount}
          icon={Dumbbell}
          color="purple"
        />

        <StatCard
          title="Últimas sessões"
          value={sessions.length}
          icon={Clock}
          color="blue"
        />

        <StatCard
          title="Minutos na semana"
          value={calcWeeklyMinutes(sessions)}
          icon={BarChart3}
          color="green"
        />
      </div>

      {/* GRÁFICO */}
      <p className="font-semibold mt-6 mb-1 text-lg">Treinos da última semana</p>
      <WeeklyChart sessions={sessions} />

      {/* ÚLTIMAS SESSÕES */}
      <h2 className="text-xl font-bold mt-8">Últimas sessões</h2>

      {loading ? (
        <div className="flex flex-col gap-4 mt-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {lastSessions.length === 0 && (
            <div className="text-muted-foreground text-sm">
              Nenhuma sessão registrada ainda.
            </div>
          )}

          {lastSessions.map((s) => (
            <RecentSessionCard key={s.id} session={s} />
          ))}
        </div>
      )}

      {/* CTA */}
      <Button
        onClick={() => router.push("/rotinas")}
        className="mt-10 mx-auto bg-purple-600 hover:bg-purple-700 flex items-center gap-2 px-8 py-6 text-lg"
      >
        <Plus className="w-5 h-5" />
        Nova sessão de treino
      </Button>
    </div>
  )
}

/* =====================================================================
   COMPONENTE: StatCard
   ===================================================================== */
function StatCard({
  title,
  value,
  icon: Icon,
  color = "purple",
}: {
  title: string
  value: number
  icon: any
  color?: "purple" | "blue" | "green"
}) {
  const colorMap = {
    purple: "text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40",
    blue: "text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40",
    green: "text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900/40",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-card dark:bg-card/80 p-4 shadow-sm flex flex-col gap-3"
    >
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorMap[color])}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </motion.div>
  )
}

/* =====================================================================
   COMPONENTE: RecentSessionCard
   ===================================================================== */
function RecentSessionCard({ session }: { session: Session }) {
  const router = useRouter()
  const duration = calcDuration(session)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => router.push(`/historico/${session.id}`)}
      className="rounded-xl border p-4 bg-card dark:bg-card/80 shadow-sm cursor-pointer hover:bg-muted/30 transition"
    >
      <div className="font-semibold text-lg">{session.routineName}</div>

      <div className="text-sm text-muted-foreground">
        {new Date(session.startedAt).toLocaleDateString("pt-BR")} • {duration}
      </div>
    </motion.div>
  )
}

/* =====================================================================
   COMPONENTE: WeeklyChart (gráfico SVG leve)
   ===================================================================== */
function WeeklyChart({ sessions }: { sessions: Session[] }) {
  const data = calcWeeklyChartData(sessions)
  const max = Math.max(...data.map(d => d.totalMinutes), 1)

  return (
    <div className="flex gap-4 mt-4 h-32 items-end">
      {data.map((d) => (
        <div key={d.day} className="flex flex-col items-center gap-1 flex-1">

          <div
            className="w-full rounded-md bg-purple-400 dark:bg-purple-700"
            style={{
              height: `${(d.totalMinutes / max) * 100}%`,
              transition: "height 0.4s",
            }}
          />

          <span className="text-xs text-muted-foreground">{d.day}</span>
        </div>
      ))}
    </div>
  )
}

/* =====================================================================
   FUNÇÕES AUXILIARES
   ===================================================================== */
function calcDuration(session: Session) {
  const ms = new Date(session.finishedAt).getTime() - new Date(session.startedAt).getTime()
  const min = Math.floor(ms / 1000 / 60)
  const sec = Math.floor((ms / 1000) % 60)
  return `${min}m ${sec}s`
}

function calcWeeklyMinutes(sessions: Session[]) {
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000
  const now = Date.now()

  return sessions
    .filter(s => now - new Date(s.startedAt).getTime() <= oneWeekMs)
    .reduce((acc, s) => {
      const ms = new Date(s.finishedAt).getTime() - new Date(s.startedAt).getTime()
      return acc + Math.floor(ms / 1000 / 60)
    }, 0)
}

function calcWeeklyChartData(sessions: Session[]) {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const base = days.map((day) => ({
    day,
    totalMinutes: 0,
  }))

  const now = Date.now()
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000

  sessions.forEach((s) => {
    const date = new Date(s.startedAt)
    if (now - date.getTime() <= oneWeekMs) {
      const day = date.getDay()
      const ms = new Date(s.finishedAt).getTime() - date.getTime()
      base[day].totalMinutes += Math.floor(ms / 1000 / 60)
    }
  })

  return base
}
