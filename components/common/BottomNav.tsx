"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dumbbell, ListTodo, BarChart2, History, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { href: "/rotinas", icon: Dumbbell, label: "Rotinas" },
    { href: "/historico", icon: History, label: "Histórico" },
    { href: "/estatisticas", icon: BarChart2, label: "Stats" },
    { href: "/configuracoes", icon: Settings, label: "Config" },
  ]

  return (
    <nav className="
      fixed bottom-0 left-0 right-0
      border-t bg-background/90 backdrop-blur
      sm:hidden p-2 flex justify-around
    ">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href)
        const Icon = tab.icon

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg",
              active && "text-purple-600 font-medium"
            )}
          >
            <Icon className={cn("w-6 h-6", active && "text-purple-600")} />
            <span className="text-xs">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
