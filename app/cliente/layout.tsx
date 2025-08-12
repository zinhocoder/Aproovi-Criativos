"use client"

import { Inter } from 'next/font/google'
// import { AuthGuard } from '@/components/auth-guard'
import { Toaster } from '@/components/ui/toaster'
import { ClientSidebar } from '@/components/client-sidebar'

const inter = Inter({ subsets: ['latin'] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      {/* <AuthGuard> */}
        <div className="flex h-screen bg-background">
          <ClientSidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      {/* </AuthGuard> */}
    </div>
  )
}