'use server'

/**
 * 🔐 Video Stream Server Actions
 * 강의 영상에 대한 보안 토큰 발급을 담당합니다.
 * 이 파일은 서버에서만 실행되며, 클라이언트에 노출되지 않습니다.
 */

import { generateSignedToken, getStreamUrl } from '@/lib/cloudflare/stream'
import { verifyEnrollment } from './enrollment'
import { getCurrentUser } from '@/lib/auth/session'

interface VideoTokenResult {
    success: boolean
    token?: string
    streamUrl?: string
    error?: string
}

/**
 * 레슨 영상에 대한 보안 토큰 발급
 * 
 * @param lessonId - 레슨 ID
 * @returns 서명된 토큰과 스트리밍 URL
 * 
 * @security
 * 1. 사용자 인증 확인
 * 2. 수강 권한 확인 (Enrollment)
 * 3. 권한 확인 후에만 Cloudflare Signed Token 발급
 */
export async function getVideoToken(lessonId: string): Promise<VideoTokenResult> {
    try {
        // 1. 사용자 인증 확인
        const user = await getCurrentUser()
        if (!user) {
            return { success: false, error: 'Unauthorized: Please login first' }
        }

        // 2. 수강 권한 확인
        const enrollment = await verifyEnrollment(user.id, lessonId)
        if (!enrollment.hasAccess) {
            return { success: false, error: 'Forbidden: No enrollment for this course' }
        }

        // 3. 레슨에서 video_uid 조회 (TODO: DB 연동 후 구현)
        const videoUid = enrollment.videoUid
        if (!videoUid) {
            return { success: false, error: 'Video not found for this lesson' }
        }

        // 4. Cloudflare Signed Token 발급 (1시간 유효)
        const token = await generateSignedToken(videoUid, { exp: 3600 })
        const streamUrl = getStreamUrl(token)

        return {
            success: true,
            token,
            streamUrl,
        }
    } catch (error) {
        console.error('[getVideoToken] Error:', error)
        return { success: false, error: 'Internal server error' }
    }
}

/**
 * 무료 프리뷰 영상에 대한 토큰 발급
 * 인증 없이 접근 가능하지만, 특정 플래그가 있는 레슨만 허용
 */
export async function getPreviewVideoToken(lessonId: string): Promise<VideoTokenResult> {
    try {
        // TODO: DB에서 레슨 조회 및 is_free_preview 확인
        // const lesson = await db.lessons.findUnique({ where: { id: lessonId } })
        // if (!lesson?.is_free_preview) {
        //   return { success: false, error: 'This lesson is not available for preview' }
        // }

        // 임시: 프리뷰 기능은 DB 연동 후 활성화
        return { success: false, error: 'Preview feature not yet implemented' }
    } catch (error) {
        console.error('[getPreviewVideoToken] Error:', error)
        return { success: false, error: 'Internal server error' }
    }
}
