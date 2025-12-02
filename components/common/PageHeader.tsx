"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  className
}: {
  title: string
  subtitle?: string
  icon?: any
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {Icon && (
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
          <Icon className="w-6 h-6 text-purple-600 dark:text-purple-300" />
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
