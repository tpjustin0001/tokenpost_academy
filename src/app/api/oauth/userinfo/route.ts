/**
 * OAuth UserInfo Proxy
 * CORS 우회를 위한 사용자 정보 조회 프록시 엔드포인트
 * 
 * GET /api/oauth/userinfo
 */

import { NextRequest, NextResponse } from 'next/server'

const TP_USERINFO_URL = 'https://oapi.tokenpost.kr/oauth/v1/userInfo'

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Missing or invalid authorization header' },
                { status: 401 }
            )
        }

        // scope 파라미터 전달
        const { searchParams } = new URL(request.url)
        const scope = searchParams.get('scope') || 'user.email,user.nickname'

        const url = new URL(TP_USERINFO_URL)
        url.searchParams.set('scope', scope)

        const response = await fetch(url.toString(), {
            headers: {
                Authorization: authHeader,
            },
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('[OAuth UserInfo Proxy] Error:', data)
            return NextResponse.json(data, { status: response.status })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('[OAuth UserInfo Proxy] Exception:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
