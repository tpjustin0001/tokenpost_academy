import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * 🔒 Next.js Middleware
 * 보호된 라우트에 대한 인증 및 권한 검사
 */

// 인증이 필요한 라우트 패턴
const protectedPatterns = [
    '/dashboard',
    '/courses/[^/]+/lesson/', // 강의실 (동적 세그먼트)
]

// 관리자만 접근 가능한 라우트
const adminPatterns = ['/admin']

// 인증된 사용자가 접근하면 안 되는 라우트 (이미 로그인된 경우)
const authPatterns = ['/login']

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 정적 파일 및 API 라우트 제외
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // TODO: Supabase 세션 확인 로직
    // 현재는 쿠키 기반 임시 체크
    const sessionCookie = request.cookies.get('mock-session')
    const isAuthenticated = !!sessionCookie

    // 보호된 라우트 체크
    const isProtectedRoute = protectedPatterns.some((pattern) => {
        const regex = new RegExp(`^${pattern.replace('[^/]+', '[^/]+')}`)
        return regex.test(pathname)
    })

    // 관리자 라우트 체크
    const isAdminRoute = adminPatterns.some((pattern) =>
        pathname.startsWith(pattern)
    )

    // 인증 라우트 체크 (로그인 페이지 등)
    const isAuthRoute = authPatterns.some((pattern) =>
        pathname.startsWith(pattern)
    )

    // 인증되지 않은 사용자가 보호된 라우트 접근 시
    if ((isProtectedRoute || isAdminRoute) && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 관리자 라우트에 대한 역할 확인
    if (isAdminRoute && isAuthenticated) {
        // TODO: 실제 역할 확인 로직
        // const session = await verifySession(request)
        // if (session?.role !== 'admin') {
        //   return NextResponse.redirect(new URL('/', request.url))
        // }

        // 임시: mock-admin 쿠키로 관리자 체크
        const adminCookie = request.cookies.get('mock-admin')
        if (!adminCookie) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // 이미 로그인한 사용자가 로그인 페이지 접근 시
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * 다음 경로를 제외한 모든 요청에 대해 미들웨어 실행:
         * - _next/static (정적 파일)
         * - _next/image (이미지 최적화)
         * - favicon.ico (파비콘)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
