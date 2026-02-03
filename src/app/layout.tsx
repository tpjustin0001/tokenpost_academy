import type { Metadata } from 'next'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import { ClientLayout } from '@/components/layout/ClientLayout'
import './globals.css'

import { getCourses } from '@/actions/courses'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = {
  title: 'TokenPost Academy',
  description: 'Web3 & Crypto Education Platform',
}

import { ThemeProvider } from '@/components/theme-provider'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const courses = await getCourses()
  const user = await getSession()

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white antialiased transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <ClientLayout courses={courses} user={user}>
              {children}
            </ClientLayout>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
