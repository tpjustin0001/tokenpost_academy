'use server'

/**
 * 🔐 구독자 접근 제어
 * 토큰포스트 구독자 여부 확인 및 영상 접근 권한 관리
 */

// 구독자 등급 정의 (TokenPost grade 기준)
// TODO: 실제 TokenPost 등급 체계에 맞게 수정
const SUBSCRIBER_GRADES = [
    'premium',
    'vip',
    'subscriber',
    '구독자',
    '프리미엄',
]

export interface SubscriptionStatus {
    isSubscriber: boolean
    grade: string | null
    canWatchVideos: boolean
}

/**
 * 사용자의 구독 상태 확인
 * TokenPost OAuth에서 받은 grade 정보로 판단
 */
export async function checkSubscriptionStatus(
    userGrade: string | null | undefined
): Promise<SubscriptionStatus> {
    // grade가 없으면 비구독자
    if (!userGrade) {
        return {
            isSubscriber: false,
            grade: null,
            canWatchVideos: false,
        }
    }

    // 구독자 등급인지 확인 (대소문자 무시)
    const normalizedGrade = userGrade.toLowerCase()
    const isSubscriber = SUBSCRIBER_GRADES.some((g) =>
        normalizedGrade.includes(g.toLowerCase())
    )

    return {
        isSubscriber,
        grade: userGrade,
        canWatchVideos: isSubscriber,
    }
}

/**
 * 영상 시청 권한 확인
 * - 구독자: 모든 영상 시청 가능
 * - 비구독자: 무료 프리뷰만 시청 가능
 */
export async function canAccessVideo(
    userGrade: string | null | undefined,
    isFreePreview: boolean = false
): Promise<{ canAccess: boolean; reason?: string }> {
    // 무료 프리뷰는 누구나 시청 가능
    if (isFreePreview) {
        return { canAccess: true }
    }

    const subscription = await checkSubscriptionStatus(userGrade)

    if (subscription.canWatchVideos) {
        return { canAccess: true }
    }

    return {
        canAccess: false,
        reason: '토큰포스트 구독자만 시청할 수 있습니다.',
    }
}
