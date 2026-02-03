'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useSidebar } from './SidebarContext'
// SVG 아이콘 컴포넌트
const Icons = {
    home: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    courses: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    ),
    live: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    ),
    progress: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
}

// 사이드바 메뉴
const SIDEBAR_MENU = [
    { icon: Icons.home, label: '홈', href: '/' },
    { icon: Icons.courses, label: '전체 강의', href: '/courses' },
    { icon: Icons.live, label: '라이브', href: '/live' },
    { icon: Icons.progress, label: '내 학습', href: '/dashboard' },
]



type SidebarProps = {
    courses?: {
        id: string
        title: string
        slug: string
        phase: number
        modules: {
            id: string
            title: string
            lessons: {
                id: string
                title: string
            }[]
        }[]
    }[]
    user?: any
}

import { ModeToggle } from '@/components/ui/mode-toggle'
import { logout } from '@/actions/auth'

export function Sidebar({ courses = [], user }: SidebarProps) {
    const pathname = usePathname()
    const { isOpen, toggle } = useSidebar()
    const collapsed = !isOpen

    const handleLogout = async () => {
        await logout()
    }

    return (
        <aside className={`hidden md:flex fixed top-0 left-0 h-screen backdrop-blur-xl bg-white/80 dark:bg-black/40 border-r border-slate-200 dark:border-white/5 z-40 transition-all duration-300 flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
            {/* Logo */}
            <div className="h-20 px-5 flex items-center justify-between">
                {!collapsed && (
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative w-10 h-10">
                            <Image
                                src="/images/tokenpost-emblem.png"
                                alt="TokenPost Academy"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold tracking-tight text-slate-900 dark:text-white">TokenPost</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">Academy</span>
                        </div>
                    </Link>
                )}
                {collapsed && (
                    <div className="relative w-10 h-10 mx-auto">
                        <Image
                            src="/images/tokenpost-emblem.png"
                            alt="TokenPost Academy"
                            fill
                            className="object-contain"
                        />
                    </div>
                )}
            </div>

            {/* Menu */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                {SIDEBAR_MENU.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href || '#'}
                            className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 text-blue-600 dark:text-white border border-blue-200 dark:border-white/10 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                } ${collapsed ? 'justify-center px-3' : ''}`}
                        >
                            {item.icon}
                            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                        </Link>
                    )
                })}

                {/* Phase 목록 */}
                {!collapsed && (
                    <div className="my-4 border-t border-slate-200 dark:border-white/5 pt-4">
                        <div className="px-4 mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                            학습 로드맵
                        </div>
                        <Accordion type="multiple" defaultValue={courses.map(c => c.id)} className="w-full">
                            {courses.map((course) => (
                                <AccordionItem key={course.id} value={course.id} className="border-none">
                                    <AccordionTrigger className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all hover:no-underline [&[data-state=open]]:text-slate-900 dark:[&[data-state=open]]:text-white [&[data-state=open]]:bg-slate-100 dark:[&[data-state=open]]:bg-white/5">
                                        <div className="flex items-center gap-2 overflow-hidden w-full">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-blue-500 transition-colors flex-shrink-0" />
                                            <Link
                                                href={`/courses/${course.slug}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="truncate text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-1"
                                            >
                                                {course.title}
                                            </Link>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-1 pt-1">
                                        <div className="pl-4 space-y-0.5 relative">
                                            <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200 dark:bg-white/10" />
                                            {course.modules?.map((module, idx) => (
                                                <div key={module.id} className="mb-3 last:mb-0">
                                                    <div className="px-4 py-1.5 text-xs font-semibold text-slate-900 dark:text-white/90">
                                                        {module.title}
                                                    </div>
                                                    <div className="space-y-0.5 border-l border-slate-200 dark:border-white/10 ml-6 pl-2">
                                                        {module.lessons?.map((lesson: any) => (
                                                            <Link
                                                                key={lesson.id}
                                                                href={`/courses/${course.slug}/lesson/${lesson.id}`}
                                                                className="block px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-colors truncate"
                                                            >
                                                                {lesson.title}
                                                            </Link>
                                                        ))}
                                                        {(!module.lessons || module.lessons.length === 0) && (
                                                            <div className="px-2 py-1 text-xs text-slate-400 italic">No Content</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex flex-col gap-2 z-50">
                {/* Theme Toggle & Collapse */}
                <div className="flex items-center gap-2 justify-between">
                    <ModeToggle />
                    <button
                        onClick={toggle}
                        className="bg-transparent hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg transition"
                    >
                        <svg className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* User Info or Login */}
                {!collapsed && (
                    user ? (
                        <div className="space-y-2 pt-2">
                            <div className="flex flex-col px-1">
                                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                    {user.nickname || user.name || 'Member'}
                                </span>
                                <span className="text-xs text-slate-500 truncate">{user.email}</span>
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="w-full border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                                로그아웃
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login" className="w-full">
                            <Button className="w-full bg-slate-900 dark:bg-gradient-to-r dark:from-blue-600 dark:to-purple-600 hover:bg-slate-700 text-white border-0 shadow-sm">
                                로그인
                            </Button>
                        </Link>
                    )
                )}
            </div>
        </aside>
    )
}
