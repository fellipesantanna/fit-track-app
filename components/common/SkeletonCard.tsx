"use client"

import { cn } from "@/lib/utils"

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn(
      "rounded-xl border bg-muted/30 dark:bg-muted/10 animate-pulse p-4 h-[120px]",
      className
    )}>
      <div className="h-4 w-1/3 bg-muted dark:bg-muted/20 rounded mb-3" />
      <div className="h-3 w-1/2 bg-muted dark:bg-muted/20 rounded mb-2" />
      <div className="h-3 w-1/4 bg-muted dark:bg-muted/20 rounded" />
    </div>
  )
}
