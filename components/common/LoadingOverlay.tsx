"use client"

import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[999]"
        >
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
