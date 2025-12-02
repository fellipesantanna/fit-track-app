"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      // Allow auth page without authentication
      if (pathname === "/auth") {
        setIsChecking(false)
        return
      }

      // Check if user is authenticated
      if (!auth.isAuthenticated()) {
        router.push("/auth")
        return
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [pathname, router])

  // Show nothing while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return <>{children}</>
}
