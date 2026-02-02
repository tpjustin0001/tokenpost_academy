'use client'

import { usePathname } from 'next/navigation'
import { useSidebar } from '@/components/layout/SidebarContext'
import { Sidebar } from '@/components/layout/Sidebar'

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const { isOpen } = useSidebar()
    const pathname = usePathname()

    // Admin 페이지에서는 메인 사이드바 제외 (Admin 자체 사이드바 사용)
    const isAdminRoute = pathname?.startsWith('/admin')

    if (isAdminRoute) {
        return <>{children}</>
    }

    return (
        <>
            <Sidebar />
            <main className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
                {children}
            </main>
        </>
    )
}
