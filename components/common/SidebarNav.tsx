"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dumbbell, History, BarChart2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function SidebarNav() {
  const pathname = usePathname()

  const tabs = [
    { href: "/rotinas", icon: Dumbbell, label: "Rotinas" },
    { href: "/historico", icon: History, label: "Histórico" },
    { href: "/estatisticas", icon: BarChart2, label: "Stats" },
    { href: "/configuracoes", icon: Settings, label: "Config" },
  ]

  return (
    <aside
      className="
        hidden md:flex
        flex-col w-60 h-screen
        border-r bg-background/70 backdrop-blur
        p-4 gap-4 fixed left-0 top-0
      "
    >
      <h2 className="text-xl font-semibold px-2 mb-4">FitTrack</h2>

      <nav className="flex flex-col gap-2">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href)
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-muted",
                active && "bg-muted font-medium text-purple-600"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "text-purple-600")} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
