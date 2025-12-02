"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ActivityIcon, TrendingUpIcon, ClockIcon, RouteIcon, ArrowUpIcon, ArrowDownIcon } from "@/components/icons"

import { sessionsApi } from "@/lib/sessions"
import { exercisesApi } from "@/lib/exercises"
import type { WorkoutSession, Exercise } from "@/lib/types"

import { startOfWeek, endOfWeek, subWeeks, isWithinInterval } from "date-fns"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

type Period = "current" | "previous"

interface WeekStats {
  totalSessions: number
  setsByRoutine: Record<string, number>
  totalDuration: number // minutos
  totalDistance: number // km
}

export default function EstatisticasPage() {
  const { toast } = useToast()

  const [period, setPeriod] = useState<Period>("current")

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [sessions, setSessions] = useState<WorkoutSession[]>([])

  const [currentWeek, setCurrentWeek] = useState<WeekStats>({
    totalSessions: 0,
    setsByRoutine: {},
    totalDuration: 0,
    totalDistance: 0,
  })

  const [previousWeek, setPreviousWeek] = useState<WeekStats>({
    totalSessions: 0,
    setsByRoutine: {},
    totalDuration: 0,
    totalDistance: 0,
  })

  const [loading, setLoading] = useState(true)

  // -------------------------------------------------------------
  // LOAD SESSIONS + EXERCISES
  // -------------------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        const [dbSessions, allEx] = await Promise.all([sessionsApi.getAll(), exercisesApi.getAll()])

        setSessions(dbSessions)
        setExercises(allEx)

        computeStats(dbSessions, allEx)
      } catch (err) {
        toast({
          title: "Erro ao carregar estatísticas",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // -------------------------------------------------------------
  // CALCULAR ESTATÍSTICAS
  // -------------------------------------------------------------
  const computeStats = (allSessions: WorkoutSession[], allExercises: Exercise[]) => {
    const now = new Date()

    const currStart = startOfWeek(now, { weekStartsOn: 1 })
    const currEnd = endOfWeek(now, { weekStartsOn: 1 })

    const prevStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
    const prevEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })

    const currentWeekSessions = allSessions.filter((s) =>
      isWithinInterval(new Date(s.date), { start: currStart, end: currEnd }),
    )

    const previousWeekSessions = allSessions.filter((s) =>
      isWithinInterval(new Date(s.date), { start: prevStart, end: prevEnd }),
    )

    setCurrentWeek(calculateWeekStats(currentWeekSessions, allExercises))
    setPreviousWeek(calculateWeekStats(previousWeekSessions, allExercises))
  }

  // -------------------------------------------------------------
  // FUNÇÃO QUE CALCULA AS ESTATÍSTICAS DE UMA SEMANA
  // -------------------------------------------------------------
  const calculateWeekStats = (weekSessions: WorkoutSession[], allExercises: Exercise[]): WeekStats => {
    const setsByRoutine: Record<string, number> = {}
    let totalDurationSec = 0
    let totalDistanceMeters = 0

    weekSessions.forEach((session) => {
      const routineName = session.routineName || "Treino vazio"

      // séries por rotina
      const setsCount = session.exercises.reduce((total, se) => total + se.sets.length, 0)
      setsByRoutine[routineName] = (setsByRoutine[routineName] || 0) + setsCount

      // distância e duração
      session.exercises.forEach((sessionExercise) => {
        const exercise = allExercises.find((e) => e.id === sessionExercise.exerciseId)
        if (!exercise) return

        if (exercise.category === "distance-duration") {
          sessionExercise.sets.forEach((set) => {
            if (set.durationSec) totalDurationSec += set.durationSec
            if (set.distanceM) totalDistanceMeters += set.distanceM
          })
        }

        if (exercise.category === "duration") {
          sessionExercise.sets.forEach((set) => {
            if (set.durationSec) totalDurationSec += set.durationSec
          })
        }
      })
    })

    return {
      totalSessions: weekSessions.length,
      setsByRoutine,
      totalDuration: Math.round(totalDurationSec / 60), // minutos
      totalDistance: Math.round(totalDistanceMeters / 1000), // km
    }
  }

  // -------------------------------------------------------------
  // COMPARAÇÃO entre semanas
  // -------------------------------------------------------------
  const compare = (curr: number, prev: number) => {
    if (prev === 0) return { direction: "neutral", percentage: 0, change: 0 }

    const diff = curr - prev
    const pct = Math.round((diff / prev) * 100)

    return {
      direction: diff > 0 ? "up" : diff < 0 ? "down" : "neutral",
      percentage: Math.abs(pct),
      change: diff,
    }
  }

  const displayedStats = period === "current" ? currentWeek : previousWeek

  const totalSetsCurr = Object.values(currentWeek.setsByRoutine).reduce((acc, v) => acc + v, 0)

  const totalSetsPrev = Object.values(previousWeek.setsByRoutine).reduce((acc, v) => acc + v, 0)

  // -------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------
  if (loading) {
    return <main className="p-6 text-muted-foreground">Carregando estatísticas...</main>
  }

  return (
    <main className="max-w-lg mx-auto p-4 pb-24 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Estatísticas</h1>
        <p className="text-muted-foreground">Acompanhe sua evolução semanal</p>
      </div>

      <Tabs value={period} onValueChange={(p) => setPeriod(p as Period)} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="current" className="flex-1">
            Semana atual
          </TabsTrigger>
          <TabsTrigger value="previous" className="flex-1">
            Semana anterior
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ============================= */}
      {/*    1) Total de Sessões        */}
      {/* ============================= */}
      <Card className="p-4 space-y-2">
        <div className="w-8 h-8 bg-accent/10 flex items-center justify-center rounded-lg">
          <ActivityIcon className="w-4 h-4 text-accent" />
        </div>

        <div className="text-2xl font-bold">{displayedStats.totalSessions}</div>
        <p className="text-xs text-muted-foreground">Treinos realizados</p>

        {period === "current" &&
          (() => {
            const { direction, percentage, change } = compare(currentWeek.totalSessions, previousWeek.totalSessions)

            if (direction === "neutral") return null

            return (
              <div
                className={`text-xs flex items-center gap-1 ${direction === "up" ? "text-green-500" : "text-red-500"}`}
              >
                {direction === "up" ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                {percentage}% ({change > 0 ? "+" : ""}
                {change})
              </div>
            )
          })()}
      </Card>

      {/* ============================= */}
      {/*   2) Total de Séries         */}
      {/* ============================= */}
      <Card className="p-4 space-y-2">
        <div className="w-8 h-8 bg-accent/10 flex items-center justify-center rounded-lg">
          <TrendingUpIcon className="w-4 h-4 text-accent" />
        </div>

        <div className="text-2xl font-bold">
          {Object.values(displayedStats.setsByRoutine).reduce((acc, v) => acc + v, 0)}
        </div>
        <p className="text-xs text-muted-foreground">Total de séries</p>

        {/* Por rotina */}
        {Object.keys(displayedStats.setsByRoutine).length > 0 && (
          <div className="pt-2 border-t space-y-1">
            <p className="text-xs text-muted-foreground">Por rotina:</p>

            {Object.entries(displayedStats.setsByRoutine)
              .sort(([, a], [, b]) => b - a)
              .map(([routineName, count]) => (
                <div key={routineName} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{routineName}</span>
                  <span className="font-medium">{count} séries</span>
                </div>
              ))}
          </div>
        )}

        {period === "current" &&
          (() => {
            const { direction, percentage, change } = compare(totalSetsCurr, totalSetsPrev)

            if (direction === "neutral") return null

            return (
              <div
                className={`text-xs flex items-center gap-1 ${direction === "up" ? "text-green-500" : "text-red-500"}`}
              >
                {direction === "up" ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                {percentage}% ({change > 0 ? "+" : ""}
                {change})
              </div>
            )
          })()}
      </Card>

      {/* ============================= */}
      {/*   3) Duração Total           */}
      {/* ============================= */}
      <Card className="p-4 space-y-2">
        <div className="w-8 h-8 bg-accent/10 flex items-center justify-center rounded-lg">
          <ClockIcon className="w-4 h-4 text-accent" />
        </div>

        <div className="text-2xl font-bold">
          {displayedStats.totalDuration}
          <span className="text-base ml-1 text-muted-foreground">min</span>
        </div>
        <p className="text-xs text-muted-foreground">Tempo total</p>

        {period === "current" &&
          (() => {
            const { direction, percentage, change } = compare(currentWeek.totalDuration, previousWeek.totalDuration)

            if (direction === "neutral") return null

            return (
              <div
                className={`text-xs flex items-center gap-1 ${direction === "up" ? "text-green-500" : "text-red-500"}`}
              >
                {direction === "up" ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                {percentage}% ({change > 0 ? "+" : ""}
                {change})
              </div>
            )
          })()}
      </Card>

      {/* ============================= */}
      {/*   4) Distância Total         */}
      {/* ============================= */}
      <Card className="p-4 space-y-2">
        <div className="w-8 h-8 bg-accent/10 flex items-center justify-center rounded-lg">
          <RouteIcon className="w-4 h-4 text-accent" />
        </div>

        <div className="text-2xl font-bold">
          {displayedStats.totalDistance}
          <span className="text-base ml-1 text-muted-foreground">km</span>
        </div>
        <p className="text-xs text-muted-foreground">Distância total</p>

        {period === "current" &&
          (() => {
            const { direction, percentage, change } = compare(currentWeek.totalDistance, previousWeek.totalDistance)

            if (direction === "neutral") return null

            return (
              <div
                className={`text-xs flex items-center gap-1 ${direction === "up" ? "text-green-500" : "text-red-500"}`}
              >
                {direction === "up" ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                {percentage}% ({change > 0 ? "+" : ""}
                {change})
              </div>
            )
          })()}
      </Card>

      {/* ============================= */}
      {/*  NENHUM TREINO               */}
      {/* ============================= */}
      {currentWeek.totalSessions === 0 && previousWeek.totalSessions === 0 && (
        <Card className="p-8 text-center text-muted-foreground space-y-2">
          <ActivityIcon className="w-10 h-10 mx-auto" />
          <p>Nenhuma estatística disponível</p>
        </Card>
      )}
    </main>
  )
}
