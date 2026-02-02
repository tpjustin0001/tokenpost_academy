import type { Metadata } from 'next'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import { ClientLayout } from '@/components/layout/ClientLayout'
import './globals.css'

export const metadata: Metadata = {
  title: 'TokenPost Academy',
  description: 'Web3 & Crypto Education Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-slate-950 text-white antialiased">
        <SidebarProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SidebarProvider>
      </body>
    </html>
  )
}
