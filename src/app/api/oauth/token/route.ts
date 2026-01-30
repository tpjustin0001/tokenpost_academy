/**
 * OAuth Token Exchange Proxy
 * CORS 우회를 위한 토큰 교환 프록시 엔드포인트
 * 
 * POST /api/oauth/token
 */

import { NextRequest, NextResponse } from 'next/server'

const TP_TOKEN_URL = 'https://oapi.tokenpost.kr/oauth/v1/token'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const response = await fetch(TP_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: body.code,
                client_id: body.client_id,
                redirect_uri: body.redirect_uri,
                code_verifier: body.code_verifier,
                // client_secret은 서버에서만 사용 (선택사항)
                ...(process.env.TP_CLIENT_SECRET && {
                    client_secret: process.env.TP_CLIENT_SECRET,
                }),
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('[OAuth Token Proxy] Error:', data)
            return NextResponse.json(data, { status: response.status })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('[OAuth Token Proxy] Exception:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
