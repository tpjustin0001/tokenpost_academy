import { NextRequest, NextResponse } from 'next/server'
import { OAUTH_CONFIG } from '@/lib/auth/oauth'
import { createSession } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * 통합 로그인 API - 토큰 교환 + 사용자 정보 조회 + 세션 생성을 한 번에 처리
 * 클라이언트-서버 왕복을 3회에서 1회로 줄여 성능 향상
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { code, code_verifier, redirect_uri } = body

        if (!code || !code_verifier) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        }

        const clientSecret = process.env.TP_CLIENT_SECRET || 'QjLMXfJ6baEv1EVFby5SrAbs47LPn1lJShIVZKzBakWMk18Vg1UXFQxoP3DL52VAgZ4hALt1zFaBK7q3U5Ub1oqWcKpHAeRVOLu5Xxu1o7JXlcwLQCsgXd3xCZgw8rDY'

        // 1. Token Exchange
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: OAUTH_CONFIG.CLIENT_ID,
            client_secret: clientSecret,
            redirect_uri: redirect_uri || OAUTH_CONFIG.REDIRECT_URI,
            code_verifier,
        })

        const tokenResponse = await fetch(OAUTH_CONFIG.TOKEN_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams,
        })

        const tokenData = await tokenResponse.json()

        if (!tokenResponse.ok || !tokenData.access_token) {
            console.error('Token Exchange Error:', tokenData)
            return NextResponse.json({ error: tokenData.error_description || 'Token exchange failed' }, { status: 400 })
        }

        // 2. Fetch User Info
        const userResponse = await fetch(OAUTH_CONFIG.USER_INFO_ENDPOINT, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'Content-Type': 'application/json',
            },
        })

        const userData = await userResponse.json()

        if (!userResponse.ok) {
            console.error('UserInfo Error:', userData)
            return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 400 })
        }

        // Normalize user data (handle nested structure)
        const uid = userData.user?.uuid || userData.sub
        const email = userData.user?.email
        const nickname = userData.user?.nickname
        const profileImage = userData.user?.profile_image
        // subscription.Plan이 실제 멤버십 레벨 (Free, Plus, Pro 등)
        const subscriptionPlan = userData.subscription?.Plan || userData.subscription?.plan || 'free'
        const subscriptionStatus = userData.subscription?.status === 'Y'
        const subscriptionDueDate = userData.subscription?.due_date

        if (!uid || !email) {
            return NextResponse.json({
                error: 'Missing required user fields',
                received: JSON.stringify(userData)
            }, { status: 400 })
        }

        // grade: 구독 상태가 Y이면 해당 Plan 사용, 아니면 'free'
        const membershipGrade = subscriptionStatus ? subscriptionPlan.toLowerCase() : 'free'

        // 3. Sync User to Supabase (upsert)
        const supabase = createAdminClient()
        const { error: upsertError } = await supabase
            .from('users')
            .upsert({
                id: uid,
                tp_uid: uid,
                email: email,
                nickname: nickname,
                profile_image: profileImage,
                subscription_level: membershipGrade as 'free' | 'plus' | 'alpha',
                subscription_expires_at: subscriptionDueDate ? new Date(subscriptionDueDate * 1000).toISOString() : null,
                last_login_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' })

        if (upsertError) {
            console.error('User sync error:', upsertError)
            // 사용자 저장 실패해도 로그인은 계속 진행
        }

        // 4. Create Session (with grade for membership check)
        await createSession(uid, email, nickname, membershipGrade === 'admin' ? 'admin' : 'user', membershipGrade)

        return NextResponse.json({
            success: true,
            user: { uid, email, nickname, grade: membershipGrade, subscriptionStatus }
        })

    } catch (error) {
        console.error('Fast Login Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

