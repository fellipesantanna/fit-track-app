"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { PlayIcon, PauseIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StopwatchInputProps {
  value: number // in seconds
  onChange: (value: number) => void
}

export function StopwatchInput({ value, onChange }: StopwatchInputProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(value)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1
          onChange(newTime)
          return newTime
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, onChange])

  useEffect(() => {
    setTime(value)
  }, [value])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleToggle = () => {
    setIsRunning(!isRunning)
  }

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value) || 0
    setTime(newValue)
    onChange(newValue)
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="flex-1 relative">
        <Input
          type="number"
          value={time}
          onChange={handleManualChange}
          placeholder="0"
          disabled={isRunning}
          className="pr-16"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
          {formatTime(time)}
        </div>
      </div>
      <Button
        type="button"
        variant={isRunning ? "default" : "outline"}
        size="icon"
        className="h-9 w-9 shrink-0"
        onClick={handleToggle}
      >
        {isRunning ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 fill-current" />}
      </Button>
    </div>
  )
}
