"use client"

import type React from "react"

import { Input } from "@/components/ui/input"

interface DistanceInputProps {
  value: number // in meters
  onChange: (value: number) => void
}

export function DistanceInput({ value, onChange }: DistanceInputProps) {
  const km = Math.floor(value / 1000)
  const m = value % 1000

  const handleKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKm = Number.parseFloat(e.target.value) || 0
    onChange(newKm * 1000 + m)
  }

  const handleMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newM = Number.parseFloat(e.target.value) || 0
    onChange(km * 1000 + newM)
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="flex-1 flex items-center gap-1">
        <Input type="number" value={km || ""} onChange={handleKmChange} placeholder="0" className="flex-1" />
        <span className="text-xs text-muted-foreground">km</span>
      </div>
      <div className="flex-1 flex items-center gap-1">
        <Input type="number" value={m || ""} onChange={handleMChange} placeholder="0" className="flex-1" />
        <span className="text-xs text-muted-foreground">m</span>
      </div>
    </div>
  )
}
