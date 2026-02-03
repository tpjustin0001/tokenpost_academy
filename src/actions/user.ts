'use server'

import { getSession } from '@/lib/auth/session'

// 멤버십으로 인정되는 등급 리스트
const MEMBERSHIP_GRADES = ['plus', 'pro', 'premium', 'admin', 'GoldI', 'GoldII', 'GoldIII', 'GoldIV', 'GoldV', 'PlatinumI', 'PlatinumII', 'PlatinumIII', 'PlatinumIV', 'PlatinumV', 'Diamond', 'SilverI', 'SilverII', 'SilverIII', 'SilverIV', 'SilverV']

export async function getUserStatus() {
    const session = await getSession()

    if (!session) {
        return { isLoggedIn: false, hasMembership: false }
    }

    const grade = session.grade || 'free'
    // grade가 free나 Bronze 등급이 아니면 멤버십 보유로 판단
    const hasMembership = session.role === 'admin' ||
        MEMBERSHIP_GRADES.some(g => grade.toLowerCase().includes(g.toLowerCase())) ||
        (grade !== 'free' && !grade.toLowerCase().startsWith('bronze'))

    return {
        isLoggedIn: true,
        userId: session.userId,
        hasMembership,
        grade
    }
}
