"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  diff?: number // variação percentual: ex: 12.5 = +12.5%
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  diff,
  icon,
  className
}: StatCardProps) {

  const isPositive = diff !== undefined && diff >= 0
  const isNegative = diff !== undefined && diff < 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex flex-col rounded-xl border bg-card shadow-sm p-4 gap-2",
        "dark:bg-card/80 dark:border-white/10",
        className
      )}
    >
      {/* LABEL */}
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        {icon && <div className="text-purple-500">{icon}</div>}
        {label}
      </div>

      {/* VALUE */}
      <div className="text-3xl font-bold tracking-tight">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>

      {/* DIFF */}
      {diff !== undefined && (
        <div
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            isPositive && "text-green-600 dark:text-green-400",
            isNegative && "text-red-600 dark:text-red-400"
          )}
        >
          {isPositive && <ArrowUpRight className="w-4 h-4" />}
          {isNegative && <ArrowDownRight className="w-4 h-4" />}

          {diff > 0 && "+"}
          {diff.toFixed(1)}%
          <span className="text-muted-foreground ml-1 text-xs">
            vs semana anterior
          </span>
        </div>
      )}
    </motion.div>
  )
}
