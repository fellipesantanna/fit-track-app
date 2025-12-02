"use client"

import { useState, type React } from "react"
import { Input } from "@/components/ui/input"

interface TimeInputProps {
  value: number // in seconds
  onChange: (value: number) => void
  placeholder?: string
}

export function TimeInput({ value, onChange, placeholder = "00:00:00" }: TimeInputProps) {
  const [displayValue, setDisplayValue] = useState("")

  const formatToDisplay = (seconds: number) => {
    if (seconds === 0) return ""
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const parseFromDisplay = (display: string): number => {
    if (!display.trim()) return 0
    const parts = display.split(":").map((p) => Number.parseInt(p) || 0)
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts
      return hours * 3600 + minutes * 60 + seconds
    }
    return 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value)
  }

  const handleBlur = () => {
    const newValue = parseFromDisplay(displayValue)
    onChange(newValue)
    // Formatar o valor após sair do campo
    if (newValue > 0) {
      setDisplayValue(formatToDisplay(newValue))
    }
  }

  const handleFocus = () => {
    if (value === 0) {
      setDisplayValue("")
    } else {
      setDisplayValue(formatToDisplay(value))
    }
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder}
      className="font-mono"
    />
  )
}
