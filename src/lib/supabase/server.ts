/**
 * Supabase Server Client
 * Server Components, Server Actions, Route Handlers에서 사용
 */

import { createServerClient as createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerClient() {
    const cookieStore = await cookies()

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
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
 * 관리자 권한 Supabase Client (Service Role Key 사용)
 * ⚠️ 서버 사이드에서만 사용, RLS 우회
 */
export function createAdminClient() {
    return createClient(
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
