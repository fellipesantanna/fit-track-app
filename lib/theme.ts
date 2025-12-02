"use client"

export type ThemeMode = "system" | "light" | "dark"

const THEME_STORAGE_KEY = "fittrack_theme_mode"

export const theme = {
  // Obter preferência de tema do usuário
  getThemeMode(): ThemeMode {
    if (typeof window === "undefined") return "system"
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return (stored as ThemeMode) || "system"
  },

  // Salvar preferência de tema
  setThemeMode(mode: ThemeMode): void {
    if (typeof window === "undefined") return
    localStorage.setItem(THEME_STORAGE_KEY, mode)
    this.applyTheme(mode)
  },

  // Aplicar tema ao documento
  applyTheme(mode: ThemeMode): void {
    if (typeof window === "undefined") return

    const root = document.documentElement
    root.classList.remove("light", "dark")

    if (mode === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.add(systemPrefersDark ? "dark" : "light")
    } else {
      root.classList.add(mode)
    }
  },

  // Inicializar tema (chamar no layout principal)
  initialize(): void {
    if (typeof window === "undefined") return

    const mode = this.getThemeMode()
    this.applyTheme(mode)

    // Observar mudanças na preferência do sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", () => {
      if (this.getThemeMode() === "system") {
        this.applyTheme("system")
      }
    })
  },
}
