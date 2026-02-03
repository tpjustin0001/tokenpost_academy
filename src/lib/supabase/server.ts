/**
 * Supabase Server Client
 * Server Components, Server Actions, Route Handlers에서 사용
 */

import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    return createSupabaseServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }: { name: string, value: string, options: CookieOptions }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Server Component에서 호출될 경우 무시
                        // 미들웨어에서 세션 갱신 시 처리됨
                    }
                },
            },
        }
    )
}

/**
 * 정적 빌드용 Supabase Client (쿠키 미사용)
 * 빌드 타임이나 세션이 필요 없는 public 데이터 조회 시 사용
 */
export function createStaticClient() {
    return createSupabaseServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return [] },
                setAll() { },
            },
        }
    )
}

/**
 * 관리자 권한 Supabase Client (Service Role Key 사용)
 * ⚠️ 서버 사이드에서만 사용, RLS 우회
 */
export function createAdminClient() {
    return createSupabaseServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() {
                    return []
                },
                setAll() { },
            },
        }
    )
}
