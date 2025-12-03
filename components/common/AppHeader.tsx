"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, User, BarChart2, Dumbbell, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { cn } from "@/lib/utils"

export function AppHeader() {
  const pathname = usePathname()

  const titleMap: Record<string, string> = {
    "/": "Início",
    "/exercicios": "Exercícios",
    "/rotinas": "Rotinas",
    "/historico": "Histórico",
    "/estatisticas": "Estatísticas",
    "/configuracoes": "Configurações"
  }

  const title =
    titleMap[pathname] ||
    "App" // fallback

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Menu className="w-6 h-6 text-muted-foreground sm:hidden" />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link href="/configuracoes">
          <User className="w-6 h-6 text-muted-foreground hover:text-purple-500 transition" />
        </Link>
      </div>
    </header>
  )
}
