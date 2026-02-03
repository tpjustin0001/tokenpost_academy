import { NextRequest, NextResponse } from 'next/server'
import { OAUTH_CONFIG } from '@/lib/auth/oauth'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { code, code_verifier, redirect_uri } = body

        if (!code || !code_verifier) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        }

        const clientSecret = process.env.TP_CLIENT_SECRET || 'QjLMXfJ6baEv1EVFby5SrAbs47LPn1lJShIVZKzBakWMk18Vg1UXFQxoP3DL52VAgZ4hALt1zFaBK7q3U5Ub1oqWcKpHAeRVOLu5Xxu1o7JXlcwLQCsgXd3xCZgw8rDY'
        if (!clientSecret) {
            console.error('TP_CLIENT_SECRET is not defined')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        // TokenPost API 호출
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: OAUTH_CONFIG.CLIENT_ID,
            client_secret: clientSecret,
            redirect_uri: redirect_uri || OAUTH_CONFIG.REDIRECT_URI,
            code_verifier,
        })

        const response = await fetch(OAUTH_CONFIG.TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('Token Exchange Error:', data)
            return NextResponse.json(data, { status: response.status })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Proxy Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
