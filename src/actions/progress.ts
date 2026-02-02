'use server'

/**
 * 진도율 저장 Server Action
 */

import { getSession } from '@/lib/auth/session'
// import { createServerClient } from '@/lib/supabase/server'

export interface ProgressData {
    lessonId: string
    currentTime: number
    duration: number
    completed: boolean
}

export interface ProgressResult {
    success: boolean
    error?: string
}

/**
 * 레슨 진도율 저장
 */
export async function saveProgress(data: ProgressData): Promise<ProgressResult> {
    try {
        // 1. 사용자 인증 확인
        const user = await getSession()
        if (!user) {
            return { success: false, error: 'Unauthorized' }
        }

        // 2. 진도율 저장 (TODO: Supabase 연동)
        console.log('[saveProgress]', {
            userId: user.userId,
            lessonId: data.lessonId,
            currentTime: data.currentTime,
            duration: data.duration,
            progress: Math.round((data.currentTime / data.duration) * 100),
            completed: data.completed,
        })

        // TODO: Supabase에 진도 저장
        // const supabase = await createServerClient()
        // await supabase.from('user_progress').upsert({
        //   user_id: user.id,
        //   lesson_id: data.lessonId,
        //   watch_time: data.currentTime,
        //   progress_percent: Math.round((data.currentTime / data.duration) * 100),
        //   is_completed: data.completed,
        //   last_watched_at: new Date().toISOString(),
        // }, {
        //   onConflict: 'user_id, lesson_id',
        // })

        return { success: true }
    } catch (error) {
        console.error('[saveProgress] Error:', error)
        return { success: false, error: 'Failed to save progress' }
    }
}

/**
 * 레슨 완료 처리
 */
export async function markLessonComplete(lessonId: string): Promise<ProgressResult> {
    try {
        const user = await getSession()
        if (!user) {
            return { success: false, error: 'Unauthorized' }
        }

        console.log('[markLessonComplete]', {
            userId: user.userId,
            lessonId,
        })

        // TODO: Supabase에 완료 상태 저장
        // const supabase = await createServerClient()
        // await supabase.from('user_progress').upsert({
        //   user_id: user.id,
        //   lesson_id: lessonId,
        //   is_completed: true,
        //   completed_at: new Date().toISOString(),
        // }, {
        //   onConflict: 'user_id, lesson_id',
        // })

        return { success: true }
    } catch (error) {
        console.error('[markLessonComplete] Error:', error)
        return { success: false, error: 'Failed to mark lesson as complete' }
    }
}

/**
 * 사용자의 강의 진도율 조회
 */
export async function getCourseProgress(courseId: string) {
    try {
        const user = await getSession()
        if (!user) {
            return { success: false, error: 'Unauthorized', data: null }
        }

        // TODO: Supabase에서 진도 조회
        // const supabase = await createServerClient()
        // const { data } = await supabase
        //   .from('user_progress')
        //   .select('lesson_id, progress_percent, is_completed')
        //   .eq('user_id', user.id)
        //   .in('lesson_id', lessonIds)

        // Mock 데이터 반환
        return {
            success: true,
            data: {
                completedLessons: ['lesson-1', 'lesson-2'],
                totalProgress: 22,
            },
        }
    } catch (error) {
        console.error('[getCourseProgress] Error:', error)
        return { success: false, error: 'Failed to get progress', data: null }
    }
}
