"use client"

import { DumbbellIcon, HistoryIcon, BarChartIcon, SettingsIcon } from "@/components/icons"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Treino", icon: DumbbellIcon },
  { href: "/historico", label: "Histórico", icon: HistoryIcon },
  { href: "/estatisticas", label: "Stats", icon: BarChartIcon },
  { href: "/configuracoes", label: "Config", icon: SettingsIcon },
]

export function BottomNav() {
  const pathname = usePathname()

  if (pathname === "/auth") {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
