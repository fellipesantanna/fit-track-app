"use client"

import { useEffect } from "react"
import { setupKeyboardBehavior, scrollInputIntoView } from "@/lib/utils/keyboard"

export function KeyboardManager() {
  useEffect(() => {
    const cleanup = setupKeyboardBehavior()

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        scrollInputIntoView(target)
      }
    }

    document.addEventListener("focusin", handleFocus)

    return () => {
      if (cleanup) cleanup()
      document.removeEventListener("focusin", handleFocus)
    }
  }, [])

  return null
}
