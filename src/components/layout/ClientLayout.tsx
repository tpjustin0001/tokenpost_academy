'use client'

import { usePathname } from 'next/navigation'
import { useSidebar } from '@/components/layout/SidebarContext'
import { Sidebar } from '@/components/layout/Sidebar'

type ClientLayoutProps = {
    children: React.ReactNode
    courses?: {
        id: string
        title: string
        slug: string
        phase: number
        modules: any[]
    }[]
    user?: any
}

import { MobileNav } from '@/components/layout/MobileNav'

// ... existing imports ...

export function ClientLayout({ children, courses = [], user }: ClientLayoutProps) {
    const { isOpen } = useSidebar()
    const pathname = usePathname()

    // Admin 페이지에서는 메인 사이드바 제외 (Admin 자체 사이드바 사용)
    const isAdminRoute = pathname?.startsWith('/admin')

    if (isAdminRoute) {
        return <>{children}</>
    }

    return (
        <>
            <MobileNav courses={courses} user={user} />
            <Sidebar courses={courses} user={user} />
            <main className={`transition-all duration-300 md:pt-0 ${isOpen ? 'md:ml-64' : 'md:ml-20'} pt-16`}>
                {children}
            </main>
        </>
    )
}
