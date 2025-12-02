"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function EmptyState({
  title,
  description,
  icon: Icon,
  className
}: {
  title: string
  description: string
  icon?: any
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center text-center p-10 opacity-90",
        className
      )}
    >
      {Icon && (
        <Icon className="w-12 h-12 text-muted-foreground mb-4" />
      )}

      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {description}
      </p>
    </motion.div>
  )
}
