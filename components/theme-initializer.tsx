"use client"

import { useEffect } from "react"
import { theme } from "@/lib/theme"

export function ThemeInitializer() {
  useEffect(() => {
    theme.initialize()
  }, [])

  return null
}
