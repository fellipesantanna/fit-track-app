import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { ToastProvider } from "@/components/common/Toast"

export const metadata: Metadata = {
  title: "Personal Training App",
  description: "Treine com consistência",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="training-theme">
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
