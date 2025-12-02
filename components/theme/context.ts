"use client"

import { createContext, Dispatch, SetStateAction } from "react"

export const ThemeProviderContext = createContext<{
  theme: string
  setTheme: Dispatch<SetStateAction<string>>
}>({
  theme: "system",
  setTheme: () => {},
})
