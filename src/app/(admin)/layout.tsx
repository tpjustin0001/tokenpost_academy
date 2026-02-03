/**
 * Admin 레이아웃
 * 사이드바 네비게이션 + 메인 콘텐츠 영역
 */

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { getSession } from '@/lib/auth/session'

// 관리자 이메일 화이트리스트
const ADMIN_EMAILS = [
    'admin@tokenpost.kr',
    'hsv.gill@tokenpost.kr', // Add known admin emails if any, or just keep generic for now
    // TODO: 환경 변수로 이동
]

// 개발 모드 플래그 - false로 변경하여 보안 강화
const DEV_MODE = process.env.DEV_MODE === 'true'

async function checkAdminAccess() {
    // 개발 모드에서는 항상 접근 허용
    if (DEV_MODE) {
        return true
    }

    // 실제 세션 확인
    const session = await getSession()
    if (!session || !session.email) {
        return false
    }

    // 이메일 화이트리스트 체크 (또는 isAdmin 플래그 확인)
    // 현재는 간단히 이메일 목록으로 확인
    if (ADMIN_EMAILS.includes(session.email)) {
        return true
    }

    // 추가: 특정 도메인 허용 (@tokenpost.kr)
    if (session.email.endsWith('@tokenpost.kr')) {
        return true
    }

    return false
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const hasAccess = await checkAdminAccess()

    if (!hasAccess) {
        redirect('/login?redirect=/admin')
    }

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* 사이드바 */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
                {/* 로고 */}
                <div className="p-6 border-b border-slate-700">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/images/tokenpost-emblem.png"
                                alt="TokenPost Admin"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-lg font-semibold text-white">Admin</span>
                    </Link>
                </div>

                {/* 네비게이션 */}
                <nav className="flex-1 p-4 space-y-1">
                    <NavItem href="/admin" icon="📊">
                        대시보드
                    </NavItem>
                    <NavItem href="/admin/courses" icon="📚">
                        강의 관리
                    </NavItem>
                    <NavItem href="/admin/users" icon="👥">
                        사용자 관리
                    </NavItem>
                    <NavItem href="/admin/analytics" icon="📊">
                        분석
                    </NavItem>
                    <NavItem href="/admin/settings" icon="⚙️">
                        설정
                    </NavItem>
                </nav>

                {/* 하단 */}
                <div className="p-4 border-t border-slate-700">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm"
                    >
                        ← 사이트로 돌아가기
                    </Link>
                </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    )
}

function NavItem({
    href,
    icon,
    children,
}: {
    href: string
    icon: string
    children: React.ReactNode
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition"
        >
            <span>{icon}</span>
            {children}
        </Link>
    )
}
