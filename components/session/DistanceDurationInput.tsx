"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface DistanceDurationInputProps {
  distance: number
  duration: number
  onChange: (value: { distance: number; duration: number }) => void
}

export function DistanceDurationInput({
  distance,
  duration,
  onChange,
}: DistanceDurationInputProps) {
  
  const [dist, setDist] = useState(distance)
  const [time, setTime] = useState(duration)

  useEffect(() => {
    onChange({ distance: dist, duration: time })
  }, [dist, time])

  // Helpers
  function addDistance(v: number) {
    setDist((d) => Math.max(0, d + v))
  }
  function addTime(v: number) {
    setTime((t) => Math.max(0, t + v))
  }

  // Format time
  function fmt(sec: number) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  // Wheel Component
  function Wheel({
    value,
    label,
    unit,
    onIncrease,
    onDecrease,
  }: {
    value: number
    label: string
    unit?: string
    onIncrease: () => void
    onDecrease: () => void
  }) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-muted-foreground text-sm">{label}</span>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className={cn(
            "mt-2 h-24 w-24 rounded-xl",
            "bg-muted/40 dark:bg-muted/20",
            "border flex flex-col items-center justify-center"
          )}
        >
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onIncrease}
            className="p-1"
          >
            <Plus className="w-4 h-4 text-purple-500 dark:text-purple-300" />
          </motion.button>

          <motion.div layout className="text-xl font-bold">
            {value}
            {unit && <span className="ml-1 text-sm">{unit}</span>}
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onDecrease}
            className="p-1"
          >
            <Minus className="w-4 h-4 text-purple-500 dark:text-purple-300" />
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl border p-4 shadow-sm bg-card dark:bg-card/80",
        "flex flex-col gap-4 items-center"
      )}
    >
      {/* Título */}
      <div className="text-lg font-semibold text-center">
        Distância + Duração
      </div>

      {/* WHEELS */}
      <div className="flex items-center justify-center gap-6">

        {/* DISTÂNCIA */}
        <Wheel
          value={dist}
          label="Distância"
          unit="m"
          onIncrease={() => addDistance(10)}
          onDecrease={() => addDistance(-10)}
        />

        {/* DURAÇÃO */}
        <Wheel
          value={time}
          label="Tempo"
          unit="s"
          onIncrease={() => addTime(5)}
          onDecrease={() => addTime(-5)}
        />
      </div>

      {/* DISPLAY FORMATADO */}
      <motion.div
        key={time}
        initial={{ opacity: 0.0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0.0 }}
        transition={{ duration: 0.2 }}
        className="text-purple-600 dark:text-purple-300 font-semibold text-xl"
      >
        Tempo total: {fmt(time)}
      </motion.div>

      {/* PRESETS */}
      <div className="grid grid-cols-3 gap-2 mt-4 w-full">
        <Button variant="outline" onClick={() => addDistance(10)}>
          +10m
        </Button>
        <Button variant="outline" onClick={() => addDistance(100)}>
          +100m
        </Button>
        <Button variant="outline" onClick={() => addTime(30)}>
          +30s
        </Button>
      </div>
    </motion.div>
  )
}
