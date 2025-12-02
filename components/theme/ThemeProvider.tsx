"use client"

import * as React from "react"
import { ThemeProviderContext } from "./context"

type Theme = "light" | "dark" | "system"

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "app-theme",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme
  })

  // Atualiza classe do HTML
  React.useEffect(() => {
    const root = window.document.documentElement
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)

    root.classList.remove(isDark ? "light" : "dark")
    root.classList.add(isDark ? "dark" : "light")

    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  // Suporta mudança automática do sistema
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      if (theme === "system") {
        const root = window.document.documentElement
        root.classList.toggle("dark", media.matches)
        root.classList.toggle("light", !media.matches)
      }
    }

    media.addEventListener("change", handler)
    return () => media.removeEventListener("change", handler)
  }, [theme])

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      <div className="transition-colors duration-300">{children}</div>
    </ThemeProviderContext.Provider>
  )
}
