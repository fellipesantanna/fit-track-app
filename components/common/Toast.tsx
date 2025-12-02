"use client"

import { createContext, useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastMessage {
  id: string
  type: "success" | "error"
  message: string
}

interface ToastContextData {
  pushSuccess: (msg: string) => void
  pushError: (msg: string) => void
}

const ToastContext = createContext<ToastContextData | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("ToastProvider faltando")
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  function add(type: ToastMessage["type"], message: string) {
    const id = crypto.randomUUID()

    setMessages(prev => [...prev, { id, type, message }])

    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id))
    }, 4000)
  }

  return (
    <ToastContext.Provider
      value={{
        pushSuccess: (msg) => add("success", msg),
        pushError: (msg) => add("error", msg),
      }}
    >
      {children}

      {/* Render toasts */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[999]">
        <AnimatePresence>
          {messages.map(m => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={cn(
                "px-4 py-3 rounded-lg shadow-lg flex items-center gap-3",
                "border bg-card dark:bg-card/80",
                m.type === "success" && "border-green-500",
                m.type === "error" && "border-red-600"
              )}
            >
              {m.type === "success" ? (
                <CheckCircle className="text-green-500 w-5 h-5" />
              ) : (
                <AlertCircle className="text-red-600 w-5 h-5" />
              )}

              <span className="text-sm font-medium">{m.message}</span>

              <X
                className="w-4 h-4 cursor-pointer ml-2"
                onClick={() =>
                  setMessages(prev => prev.filter(n => n.id !== m.id))
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
