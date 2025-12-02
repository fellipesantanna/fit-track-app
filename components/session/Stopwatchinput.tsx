"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react"

interface StopwatchInputProps {
  value: number
  onChange: (seconds: number) => void
}

export function StopwatchInput({ value, onChange }: StopwatchInputProps) {
  const [seconds, setSeconds] = useState(value)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<any>(null)

  // Atualiza parent
  useEffect(() => {
    onChange(seconds)
  }, [seconds])

  // Liga/desliga cronômetro
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [running])

  // Formatar tempo
  function fmt(sec: number) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  // Wheel control
  function wheel(delta: number) {
    setSeconds((s) => Math.max(0, s + delta))
  }

  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl border p-4 shadow-sm bg-card dark:bg-card/80 flex flex-col gap-4 items-center"
      )}
    >

      {/* DISPLAY */}
      <AnimatePresence mode="wait">
        <motion.div
          key={seconds}
          initial={{ scale: 0.8, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 10 }}
          transition={{ duration: 0.15 }}
          className="text-5xl font-bold tracking-tight text-purple-600 dark:text-purple-300"
        >
          {fmt(seconds)}
        </motion.div>
      </AnimatePresence>

      {/* BUTTONS */}
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant={running ? "destructive" : "default"}
          onClick={() => setRunning(!running)}
        >
          {running ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            setRunning(false)
            setSeconds(0)
          }}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* WHEEL */}
      <div className="flex items-center gap-6 mt-4">

        {/* MINUTOS */}
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground">Min</span>

          <motion.div
            className="h-20 w-20 bg-muted/40 dark:bg-muted/20
            rounded-xl border flex flex-col items-center justify-center"
          >
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => wheel(60)}
              className="p-1"
            >
              <Plus className="w-4 h-4 text-purple-500 dark:text-purple-300" />
            </motion.button>

            <span className="text-xl font-bold">
              {Math.floor(seconds / 60)}
            </span>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => wheel(-60)}
              className="p-1"
            >
              <Minus className="w-4 h-4 text-purple-500 dark:text-purple-300" />
            </motion.button>
          </motion.div>
        </div>

        {/* SEGUNDOS */}
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground">Seg</span>

          <motion.div
            className="h-20 w-20 bg-muted/40 dark:bg-muted/20
            rounded-xl border flex flex-col items-center justify-center"
          >
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => wheel(5)}
              className="p-1"
            >
              <Plus className="w-4 h-4 text-purple-500 dark:text-purple-300" />
            </motion.button>

            <span className="text-xl font-bold">
              {seconds % 60}
            </span>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => wheel(-5)}
              className="p-1"
            >
              <Minus className="w-4 h-4 text-purple-500 dark:text-purple-300" />
            </motion.button>
          </motion.div>
        </div>

      </div>
    </motion.div>
  )
}
