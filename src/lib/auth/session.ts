/**
 * 🔐 Session Management
 * 사용자 세션 검증 및 관리
 */

import { cookies } from 'next/headers'
// import { createServerClient } from '@/lib/supabase/server'

export interface User {
    id: string
    email: string
    nickname?: string
    profileImage?: string
    role: 'student' | 'admin'
}

/**
 * 현재 로그인한 사용자 정보 조회
 * Server Components, Server Actions에서 사용
 */
export async function getCurrentUser(): Promise<User | null> {
    // TODO: Supabase Auth 연동 후 구현
    //
    // const supabase = createServerClient()
    // const { data: { user } } = await supabase.auth.getUser()
    //
    // if (!user) return null
    //
    // // public.users 테이블에서 추가 정보 조회
    // const { data: profile } = await supabase
    //   .from('users')
    //   .select('*')
    //   .eq('id', user.id)
    //   .single()
    //
    // return {
    //   id: user.id,
    //   email: user.email!,
    //   nickname: profile?.nickname,
    //   profileImage: profile?.profile_image,
    //   role: profile?.role || 'student',
    // }

    // 임시 Mock 데이터 (개발용)
    const cookieStore = await cookies()
    const mockSession = cookieStore.get('mock-session')

    if (mockSession) {
        return {
            id: 'mock-user-id',
            email: 'test@tokenpost.kr',
            nickname: '테스트 유저',
            role: 'student',
        }
    }

    return null
}

/**
 * 세션 검증 (Middleware에서 사용)
 * @param request - Next.js Request 객체
 */
export async function verifySession(request: Request): Promise<User | null> {
    // TODO: Supabase Auth 세션 검증
    // 이 함수는 middleware.ts에서 호출됩니다.

    // 개발 중 임시 구현
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader?.includes('mock-session')) {
        return {
            id: 'mock-user-id',
            email: 'test@tokenpost.kr',
            nickname: '테스트 유저',
            role: 'student',
        }
    }

    return null
}

/**
 * 사용자가 관리자인지 확인
 */
export async function isAdmin(): Promise<boolean> {
    const user = await getCurrentUser()
    return user?.role === 'admin'
}
