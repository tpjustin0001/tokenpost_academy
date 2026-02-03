import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth/session'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { userId, email, name, role } = body

        if (!userId || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        await createSession(userId, email, name, role)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Session Create Error:', error)
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }
}
