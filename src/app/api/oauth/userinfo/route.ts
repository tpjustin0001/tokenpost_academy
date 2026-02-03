import { NextRequest, NextResponse } from 'next/server'
import { OAUTH_CONFIG } from '@/lib/auth/oauth'

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization')

        if (!authHeader) {
            return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 })
        }

        const response = await fetch(OAUTH_CONFIG.USER_INFO_ENDPOINT, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('UserInfo Fetch Error:', data)
            return NextResponse.json(data, { status: response.status })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Proxy Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
