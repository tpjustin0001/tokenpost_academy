import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * 🔒 Next.js Middleware
 * 개발 모드: 인증 비활성화
 * 
 * 프로덕션 배포 시 아래 주석 해제하여 인증 활성화
 */

// 개발 모드 플래그 - true로 설정하면 모든 인증 우회
const DEV_MODE = true

export async function middleware(request: NextRequest) {
    // 개발 모드에서는 모든 라우트 접근 허용
    if (DEV_MODE) {
        return NextResponse.next()
    }

    // === 아래는 프로덕션용 인증 로직 (DEV_MODE = false일 때 활성화) ===
    /*
    const { pathname } = request.nextUrl
    
    // 정적 파일 및 API 라우트 제외
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    const { verifySession } = await import('@/lib/auth/session')
    const session = await verifySession()
    const isAuthenticated = !!session?.isAuth

    // 인증이 필요한 라우트 패턴
    const protectedPatterns = ['/dashboard', '/courses/[^/]+/lesson/']
    const adminPatterns = ['/admin']
    const authPatterns = ['/login']

    const isProtectedRoute = protectedPatterns.some((pattern) => {
        const regex = new RegExp(`^${pattern.replace('[^/]+', '[^/]+')}`)
        return regex.test(pathname)
    })

    const isAdminRoute = adminPatterns.some((pattern) =>
        pathname.startsWith(pattern)
    )

    const isAuthRoute = authPatterns.some((pattern) =>
        pathname.startsWith(pattern)
    )

    if ((isProtectedRoute || isAdminRoute) && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    if (isAdminRoute && isAuthenticated) {
        if (session.user?.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    */

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
