"use client"

import { useContext } from "react"
import { ThemeProviderContext } from "./context"

export function useTheme() {
  const ctx = useContext(ThemeProviderContext)
  if (!ctx) throw new Error("useTheme deve ser usado dentro do ThemeProvider")
  return ctx
}
