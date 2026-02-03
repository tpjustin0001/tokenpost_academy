'use server'

import { getSession } from '@/lib/auth/session'

export async function getUserStatus() {
    const session = await getSession()

    if (!session) {
        return { isLoggedIn: false, hasMembership: false }
    }

    return {
        isLoggedIn: true,
        userId: session.userId,
        // TODO: 실제 멤버십 로직이 있다면 여기서 체크
        // 현재는 'basic' 이상이면 멤버십 있다고 가정하거나, grade 필드 확인
        // OAUTH SCOPE에서 grade를 가져오므로 세션에 저장된 grade 확인
        hasMembership: session.role === 'admin' || (session as any).grade !== 'free',
        grade: (session as any).grade || 'free'
    }
}
