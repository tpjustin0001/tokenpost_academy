'use server'

/**
 * 🔐 Enrollment Server Actions
 * 수강 권한 확인 및 관리를 담당합니다.
 * 
 * 접근 정책:
 * - 토큰포스트 구독자: 모든 강의 시청 가능
 * - 비구독자: 강의 목록만 볼 수 있음, 무료 프리뷰만 시청 가능
 */

import { canAccessVideo } from '@/lib/auth/subscription'
// import { createServerClient } from '@/lib/supabase/server'

interface EnrollmentCheckResult {
    hasAccess: boolean
    courseId?: string
    videoUid?: string
    isFreePreview?: boolean
    reason?: string
}

/**
 * 사용자의 특정 레슨에 대한 시청 권한 확인
 * 
 * @param userId - 사용자 ID
 * @param lessonId - 레슨 ID
 * @param userGrade - 토큰포스트 회원 등급
 * @returns 접근 권한 여부와 관련 정보
 */
export async function verifyEnrollment(
    userId: string,
    lessonId: string,
    userGrade?: string | null
): Promise<EnrollmentCheckResult> {
    console.log(`[verifyEnrollment] Checking access for user: ${userId}, lesson: ${lessonId}, grade: ${userGrade}`)

    // TODO: Supabase에서 레슨 정보 조회
    // 현재는 Mock 데이터 사용
    const mockLesson = {
        id: lessonId,
        videoUid: 'mock-video-uid',
        isFreePreview: lessonId === 'lesson-1', // 첫 번째 레슨만 무료 프리뷰
        courseId: 'mock-course-id',
    }

    // 구독자 여부 확인
    const accessCheck = await canAccessVideo(userGrade, mockLesson.isFreePreview)

    if (!accessCheck.canAccess) {
        return {
            hasAccess: false,
            isFreePreview: mockLesson.isFreePreview,
            reason: accessCheck.reason,
        }
    }

    return {
        hasAccess: true,
        courseId: mockLesson.courseId,
        videoUid: mockLesson.videoUid,
        isFreePreview: mockLesson.isFreePreview,
    }
}

/**
 * 사용자가 특정 레슨을 볼 수 있는지 빠르게 확인 (목록용)
 */
export async function canViewLesson(
    userGrade: string | null | undefined,
    isFreePreview: boolean
): Promise<boolean> {
    const result = await canAccessVideo(userGrade, isFreePreview)
    return result.canAccess
}
