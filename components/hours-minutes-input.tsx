"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface HoursMinutesInputProps {
  value: number // total time in seconds
  onChange: (value: number) => void
}

export function HoursMinutesInput({ value, onChange }: HoursMinutesInputProps) {
  const [hours, setHours] = useState<string>("")
  const [minutes, setMinutes] = useState<string>("")

  useEffect(() => {
    if (value === 0) {
      setHours("")
      setMinutes("")
    } else {
      const h = Math.floor(value / 3600)
      const m = Math.floor((value % 3600) / 60)
      setHours(h.toString())
      setMinutes(m.toString())
    }
  }, [value])

  const handleHoursChange = (newHours: string) => {
    setHours(newHours)
    const h = Number.parseInt(newHours) || 0
    const m = Number.parseInt(minutes) || 0
    onChange(h * 3600 + m * 60)
  }

  const handleMinutesChange = (newMinutes: string) => {
    setMinutes(newMinutes)
    const h = Number.parseInt(hours) || 0
    const m = Number.parseInt(newMinutes) || 0
    onChange(h * 3600 + m * 60)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 flex-1">
        <Input
          type="number"
          inputMode="numeric"
          value={hours}
          onChange={(e) => handleHoursChange(e.target.value)}
          placeholder="0"
          min="0"
          className="text-center"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">h</span>
      </div>
      <div className="flex items-center gap-1 flex-1">
        <Input
          type="number"
          inputMode="numeric"
          value={minutes}
          onChange={(e) => handleMinutesChange(e.target.value)}
          placeholder="0"
          min="0"
          max="59"
          className="text-center"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">min</span>
      </div>
    </div>
  )
}
