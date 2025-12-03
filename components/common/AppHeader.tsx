"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, User } from "lucide-react"

export function AppHeader() {
  const pathname = usePathname()

  return (
    <header
      className="
    w-full border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40
    md:ml-60   // <-- empurra para a direita quando sidebar aparecer
  "
    >
      <div className="max-w-full mx-auto flex items-center justify-between p-4">


        {/* LOGO / TÍTULO */}
        <Link href="/dashboard" className="text-xl font-semibold">
          FitTrack
        </Link>

        {/* AÇÕES */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-md hover:bg-muted transition">
            <Moon className="w-5 h-5" />
          </button>

          <Link
            href="/perfil"
            className={`p-2 rounded-md hover:bg-muted transition ${pathname === "/perfil" ? "bg-muted" : ""
              }`}
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
