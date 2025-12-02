"use client"

import { useTheme } from "./useTheme"
import { Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative rounded-full"
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0, rotate: 90 }}
        transition={{ duration: 0.25 }}
        className="absolute"
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-purple-300" />
        ) : (
          <Sun className="w-5 h-5 text-purple-600" />
        )}
      </motion.div>

      {/* Icon placeholder (mantém botão com tamanho fixo) */}
      <div className="opacity-0">
        <Sun className="w-5 h-5" />
      </div>
    </Button>
  )
}
