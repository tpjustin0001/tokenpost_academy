'use server'

/**
 * 진도율 저장 Server Action
 */

import { getSession } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

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

        // 2. 진도율 저장
        const supabase = await createClient()

        const progressPercent = Math.round((data.currentTime / data.duration) * 100)

        await supabase.from('user_progress').upsert({
            user_id: user.userId, // session.userId
            lesson_id: data.lessonId,
            watch_time: data.currentTime,
            progress_percent: isNaN(progressPercent) ? 0 : progressPercent,
            is_completed: data.completed,
            last_watched_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id, lesson_id',
        })

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

        const supabase = await createClient()

        // 완료 상태만 업데이트 (기존 진도율은 유지하거나 100으로?)
        // 여기서는 is_completed만 true로 업데이트
        await supabase.from('user_progress').upsert({
            user_id: user.userId,
            lesson_id: lessonId,
            is_completed: true,
            progress_percent: 100, // 완료하면 100%로
            completed_at: new Date().toISOString(),
            last_watched_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id, lesson_id',
        })

        return { success: true }
    } catch (error) {
        console.error('[markLessonComplete] Error:', error)
        return { success: false, error: 'Failed to mark lesson as complete' }
    }
}

/**
 * 사용자의 강의 진도율 조회 (다수의 레슨)
 */
export async function getLessonsProgress(lessonIds: string[]) {
    try {
        const user = await getSession()
        if (!user) {
            return { success: false, error: 'Unauthorized', data: {} }
        }

        const supabase = await createClient()

        const { data } = await supabase
            .from('user_progress')
            .select('lesson_id, progress_percent, is_completed')
            .eq('user_id', user.userId) // session.userId
            .in('lesson_id', lessonIds)

        const progressMap: Record<string, { progress: number; isCompleted: boolean }> = {}

        if (data) {
            data.forEach((item: any) => {
                progressMap[item.lesson_id] = {
                    progress: item.progress_percent || 0,
                    isCompleted: item.is_completed || false
                }
            })
        }

        return {
            success: true,
            data: progressMap
        }
    } catch (error) {
        console.error('[getLessonsProgress] Error:', error)
        return { success: false, error: 'Failed to get progress', data: {} }
    }
}
