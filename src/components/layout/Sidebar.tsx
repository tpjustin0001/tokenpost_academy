'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSidebar } from './SidebarContext'
import { ALL_COURSES } from '@/data/courses'

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
    { icon: Icons.progress, label: '내 학습', href: '/dashboard' },
]

// Phase 컬러
const PHASE_COLORS = [
    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500' },
    { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
    { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
    { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
    { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-500' },
    { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
    { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-500' },
]

export function Sidebar() {
    const pathname = usePathname()
    const { isOpen, toggle } = useSidebar()
    const collapsed = !isOpen

    return (
        <aside className={`fixed top-0 left-0 h-screen backdrop-blur-xl bg-black/40 border-r border-white/5 z-40 transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
            {/* Logo */}
            <div className="h-20 px-5 flex items-center justify-between">
                {!collapsed && (
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/20">
                            TP
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold tracking-tight text-white">TokenPost</span>
                            <span className="text-xs text-slate-400 -mt-0.5">Academy</span>
                        </div>
                    </Link>
                )}
                {collapsed && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/20 mx-auto">
                        TP
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
                                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-white/10 shadow-lg shadow-blue-500/5'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                } ${collapsed ? 'justify-center px-3' : ''}`}
                        >
                            {item.icon}
                            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                        </Link>
                    )
                })}

                {/* Phase 목록 */}
                {!collapsed && (
                    <>
                        <div className="my-4 border-t border-white/5" />
                        <Link href="/curriculum" className="block px-4 mb-3 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
                            커리큘럼 (로드맵)
                        </Link>
                        {ALL_COURSES.map((course, i) => {
                            const colors = PHASE_COLORS[i] || PHASE_COLORS[0]
                            return (
                                <Link
                                    key={course.id}
                                    href={`/courses/${course.slug}`}
                                    className="flex items-center gap-3 px-4 py-2.5 mb-0.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all"
                                >
                                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                                    <span className="text-sm truncate">Phase {course.phase}</span>
                                </Link>
                            )
                        })}
                    </>
                )}
            </nav>

            {/* Collapse Button */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={toggle}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition"
                >
                    <svg className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Login */}
            {!collapsed && (
                <div className="p-4 border-t border-white/5">
                    <Link href="/login">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-blue-500/20">
                            로그인
                        </Button>
                    </Link>
                </div>
            )}
        </aside>
    )
}
