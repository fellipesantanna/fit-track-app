"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { sessionsApi } from "@/lib/api/session"
import { routinesApi } from "@/lib/api/routines"
import { Session } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus, Clock, BarChart3, Dumbbell } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { SkeletonCard } from "@/components/common/SkeletonCard"
import { PageHeader } from "@/components/common/PageHeader"

export default function DashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([])
  const [routinesCount, setRoutinesCount] = useState(0)

  // 🔥 PROTEÇÃO ANTI-CRASH: garante que o usuário esteja logado
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/auth/login")
        return
      }

      // só carrega o dashboard depois da sessão estar garantida
      loadDashboard()
    }

    async function loadDashboard() {
      try {
        setLoading(true)

        const [sessionsRes, routinesRes] = await Promise.all([
          sessionsApi.getAll(),
          routinesApi.getAll()
        ])

        setSessions(sessionsRes)
        setRoutinesCount(routinesRes.length)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])
