import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SECRET_KEY = process.env.SESSION_SECRET || 'your-secret-key-at-least-32-chars-long'
const key = new TextEncoder().encode(SECRET_KEY)

export type SessionPayload = {
    userId: string
    email: string
    role?: string
    name?: string
    nickname?: string
    expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key)
}

export async function decrypt(session: string | undefined = '') {
    if (!session) return null
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        })
        return payload as unknown as SessionPayload
    } catch (error) {
        console.error('Failed to verify session:', error)
        return null
    }
}

export async function createSession(userId: string, email: string, name?: string, role: string = 'user') {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, email, role, name, expiresAt })

    // Cookie Store는 Server Action이나 Route Handler에서만 사용 가능
    const cookieStore = await cookies()
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export async function verifySession() {
    const cookieStore = await cookies()
    const cookie = cookieStore.get('session')?.value

    if (!cookie) return null

    const session = await decrypt(cookie)

    if (!session?.userId) {
        return null
    }

    return { isAuth: true, userId: session.userId, user: session }
}

export async function getSession() {
    const session = await verifySession()
    if (!session) return null
    return session.user
}
