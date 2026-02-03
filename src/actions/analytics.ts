'use server'

/**
 * 분석 Server Actions
 * 수강 현황, 인기 강의, 이탈률 분석
 */

import { createClient } from '@/lib/supabase/server'

// ============ 수강 현황 (Enrollments) ============

export interface Enrollment {
    id: string
    user_id: string
    course_id: string
    enrolled_at: string
    completed_at: string | null
    progress_percent: number
    last_accessed_at: string | null
    // Joined data
    user?: { nickname: string; email: string }
    course?: { title: string; slug: string }
}

export async function getEnrollments(filters?: {
    course_id?: string
    limit?: number
}) {
    const supabase = await createClient()

    let query = supabase
        .from('enrollments')
        .select(`
            *,
            user:users(nickname, email),
            course:courses(title, slug)
        `)
        .order('enrolled_at', { ascending: false })

    if (filters?.course_id) {
        query = query.eq('course_id', filters.course_id)
    }
    if (filters?.limit) {
        query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching enrollments:', error)
        return []
    }

    return data as Enrollment[]
}

export async function getEnrollmentStats() {
    const supabase = await createClient()

    const { count: totalEnrollments } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })

    const { count: completedEnrollments } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .not('completed_at', 'is', null)

    // 최근 7일 신규 수강
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const { count: recentEnrollments } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .gte('enrolled_at', weekAgo.toISOString())

    return {
        total: totalEnrollments || 0,
        completed: completedEnrollments || 0,
        recent: recentEnrollments || 0,
        completionRate: totalEnrollments ? Math.round((completedEnrollments || 0) / totalEnrollments * 100) : 0
    }
}

// ============ 인기 강의 (Popular Courses) ============

export interface PopularCourse {
    course_id: string
    title: string
    slug: string
    enrollment_count: number
    completion_rate: number
    avg_progress: number
}

export async function getPopularCourses(limit: number = 10) {
    const supabase = await createClient()

    // 1) 강의별 수강 수 집계
    const { data: courses } = await supabase
        .from('courses')
        .select('id, title, slug')

    if (!courses || courses.length === 0) return []

    // 2) 각 강의별 통계 가져오기
    const popularCourses: PopularCourse[] = []

    for (const course of courses) {
        const { count: enrollmentCount } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id)

        const { count: completedCount } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id)
            .not('completed_at', 'is', null)

        const { data: progressData } = await supabase
            .from('enrollments')
            .select('progress_percent')
            .eq('course_id', course.id)

        const avgProgress = progressData?.length
            ? Math.round(progressData.reduce((sum, e) => sum + (e.progress_percent || 0), 0) / progressData.length)
            : 0

        popularCourses.push({
            course_id: course.id,
            title: course.title,
            slug: course.slug,
            enrollment_count: enrollmentCount || 0,
            completion_rate: enrollmentCount ? Math.round((completedCount || 0) / enrollmentCount * 100) : 0,
            avg_progress: avgProgress
        })
    }

    // 수강 수 기준 정렬
    return popularCourses
        .sort((a, b) => b.enrollment_count - a.enrollment_count)
        .slice(0, limit)
}

// ============ 이탈 분석 (Drop-off Analysis) ============

export interface LessonDropoff {
    lesson_id: string
    lesson_title: string
    module_title: string
    position: number
    started_count: number
    completed_count: number
    dropoff_rate: number
}

export async function getCourseDropoffAnalysis(courseId: string) {
    const supabase = await createClient()

    // 1) 해당 강의의 모든 레슨 가져오기 (순서대로)
    const { data: modules } = await supabase
        .from('modules')
        .select(`
            id, title, position,
            lessons(id, title, position)
        `)
        .eq('course_id', courseId)
        .order('position')

    if (!modules) return []

    // 2) 모든 레슨을 순서대로 정렬
    const allLessons: { id: string; title: string; moduleTitle: string; globalPosition: number }[] = []
    let globalPos = 0

    for (const module of modules) {
        const moduleLessons = (module.lessons as any[] || []).sort((a: any, b: any) => a.position - b.position)
        for (const lesson of moduleLessons) {
            globalPos++
            allLessons.push({
                id: lesson.id,
                title: lesson.title,
                moduleTitle: module.title,
                globalPosition: globalPos
            })
        }
    }

    // 3) 각 레슨별 진도 데이터 (user_progress 테이블)
    const dropoffData: LessonDropoff[] = []

    for (const lesson of allLessons) {
        const { count: startedCount } = await supabase
            .from('user_progress')
            .select('*', { count: 'exact', head: true })
            .eq('lesson_id', lesson.id)

        const { count: completedCount } = await supabase
            .from('user_progress')
            .select('*', { count: 'exact', head: true })
            .eq('lesson_id', lesson.id)
            .eq('is_completed', true)

        const started = startedCount || 0
        const completed = completedCount || 0

        dropoffData.push({
            lesson_id: lesson.id,
            lesson_title: lesson.title,
            module_title: lesson.moduleTitle,
            position: lesson.globalPosition,
            started_count: started,
            completed_count: completed,
            dropoff_rate: started > 0 ? Math.round((started - completed) / started * 100) : 0
        })
    }

    return dropoffData
}

// ============ 레슨별 시청 시간 분석 ============

export async function getWatchTimeAnalysis(courseId: string) {
    const supabase = await createClient()

    const { data } = await supabase
        .from('user_progress')
        .select(`
            lesson_id,
            watch_time_seconds,
            lesson:lessons(title, duration)
        `)
        .eq('lessons.module.course_id', courseId)

    // 레슨별 평균 시청 시간 집계
    const lessonStats = new Map<string, { title: string; totalTime: number; count: number }>()

    for (const record of data || []) {
        const lessonId = record.lesson_id
        const existing = lessonStats.get(lessonId)

        if (existing) {
            existing.totalTime += record.watch_time_seconds || 0
            existing.count++
        } else {
            lessonStats.set(lessonId, {
                title: (record.lesson as any)?.title || 'Unknown',
                totalTime: record.watch_time_seconds || 0,
                count: 1
            })
        }
    }

    return Array.from(lessonStats.entries()).map(([id, stats]) => ({
        lesson_id: id,
        lesson_title: stats.title,
        avg_watch_time: Math.round(stats.totalTime / stats.count),
        total_views: stats.count
    }))
}
