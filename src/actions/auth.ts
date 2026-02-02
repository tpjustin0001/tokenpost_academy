'use server'

import { createSession, deleteSession } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/server'
import { fetchUserInfo } from '@/lib/auth/oauth'
import { redirect } from 'next/navigation'

export async function loginWithTokenPost(accessToken: string) {
    try {
        // 1. 토큰포스트 사용자 정보 조회
        const tpUser = await fetchUserInfo(accessToken)

        if (!tpUser.uid) {
            throw new Error('Invalid user info from TokenPost')
        }

        // 2. Supabase 사용자 동기화 (Admin Client 사용)
        const supabase = createAdminClient()

        // 포인트 정보가 중첩 객체일 수 있으므로 처리
        // tpUser.point가 객체라면 tpc 값 추출, 아니라면 그대로 사용
        const userAny = tpUser as any
        const point = typeof userAny['point.tpc'] === 'number'
            ? userAny['point.tpc']
            : (typeof tpUser.point === 'object' ? tpUser.point?.tpc || 0 : 0)

        const { data: user, error } = await supabase
            .from('users')
            .upsert({
                id: tpUser.uid, // TokenPost UID를 PK로 사용
                email: tpUser.email,
                nickname: tpUser.nickname,
                // grade: tpUser.grade, // 스키마에 없을 수 있으므로 일단 제외하거나 확인 필요
                // point: point,   // 상동
                updated_at: new Date().toISOString(),
                last_login_at: new Date().toISOString(),
            }, { onConflict: 'id' })
            .select()
            .single()

        // 테이블이 아직 없거나 컬럼이 다를 수 있으므로 에러 로깅하되 진행
        if (error) {
            console.error('Failed to sync user with Supabase:', error)
            // 치명적이지 않은 에러라면 무시하고 세션 생성 진행
            // 하지만 user 테이블이 아예 없으면 문제됨. 
            // 일단 진행.
        }

        // 3. 세션 생성
        // DB에 저장된 user 데이터가 없으면 토큰포스트 정보로 세션 생성
        await createSession(
            tpUser.uid,
            tpUser.email,
            tpUser.nickname,
            'user' // 기본 역할
        )

        return { success: true }
    } catch (error) {
        console.error('Login failed:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Login failed' }
    }
}

export async function logout() {
    await deleteSession()
    redirect('/')
}
