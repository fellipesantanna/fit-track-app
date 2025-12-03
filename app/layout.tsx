import "./globals.css"
import { AppHeader } from "@/components/common/AppHeader"
import { BottomNav } from "@/components/common/BottomNav"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        
        {/* HEADER */}
        <AppHeader />

        {/* MAIN */}
        <main className="flex-1 pb-20">
          {children}
        </main>

        {/* MOBILE NAV */}
        <BottomNav />

      </body>
    </html>
  )
}
