import { NextRequest, NextResponse } from 'next/server'
import { OAUTH_CONFIG } from '@/lib/auth/oauth'
import { createSession } from '@/lib/auth/session'

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
        const grade = userData.grade?.code

        if (!uid || !email) {
            return NextResponse.json({
                error: 'Missing required user fields',
                received: JSON.stringify(userData)
            }, { status: 400 })
        }

        // 3. Create Session
        await createSession(uid, email, nickname, grade === 'admin' ? 'admin' : 'user')

        return NextResponse.json({
            success: true,
            user: { uid, email, nickname, grade }
        })

    } catch (error) {
        console.error('Fast Login Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
