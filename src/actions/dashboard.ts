'use server'

import { createServerClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'

export interface DashboardStat {
    label: string
    value: string | number
}

export interface DashboardCourse {
    id: string
    title: string
    slug: string
    description: string | null
    thumbnail_url: string | null
    totalLessons: number
    completedLessons: number
    progressPercent: number
    lastWatchedAt: string | null
}

export interface DashboardData {
    user: {
        email: string
        nickname: string
        role: string
    }
    stats: {
        enrolledCourses: number
        totalProgress: number
        certificates: number
    }
    recentCourses: DashboardCourse[]
}

export async function getUserDashboardData(): Promise<DashboardData | null> {
    const session = await getSession()
    if (!session) return null

    const supabase = await createServerClient()
    const { userId } = session

    // 1. Fetch all courses with structure
    const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
            id,
            title,
            slug,
            description,
            thumbnail_url,
            modules (
                id,
                lessons (id)
            )
        `)
        .eq('status', 'published') // Only published courses

    if (coursesError) {
        console.error('Error fetching courses for dashboard:', coursesError)
        return null
    }

    // 2. Fetch user progress
    const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('lesson_id, is_completed, updated_at')
        .eq('user_id', userId)

    if (progressError) {
        console.error('Error fetching user progress:', progressError)
        // Continue with empty progress
    }

    const userProgress = progressData || []
    const completedLessonIds = new Set(
        userProgress.filter(p => p.is_completed).map(p => p.lesson_id)
    )

    // 3. Calculate stats per course
    const recentCourses: DashboardCourse[] = []
    let totalLessonsCount = 0
    let totalCompletedCount = 0

    coursesData?.forEach((course: any) => {
        let courseTotalLessons = 0
        let courseCompletedLessons = 0
        let lastWatched: string | null = null

        const courseLessonIds: string[] = []

        course.modules?.forEach((module: any) => {
            module.lessons?.forEach((lesson: any) => {
                courseLessonIds.push(lesson.id)
                courseTotalLessons++
                if (completedLessonIds.has(lesson.id)) {
                    courseCompletedLessons++
                    totalCompletedCount++
                }
            })
        })

        if (courseTotalLessons > 0) {
            totalLessonsCount += courseTotalLessons
        }

        // Find last watched time for this course
        const courseProgressEntries = userProgress.filter(p => courseLessonIds.includes(p.lesson_id))

        // Check if user has ANY progress in this course
        if (courseProgressEntries.length > 0) {
            // Find most recent updated_at
            courseProgressEntries.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            if (courseProgressEntries.length > 0) lastWatched = courseProgressEntries[0].updated_at

            const progressPercent = courseTotalLessons > 0
                ? Math.round((courseCompletedLessons / courseTotalLessons) * 100)
                : 0

            recentCourses.push({
                id: course.id,
                title: course.title,
                slug: course.slug,
                description: course.description,
                thumbnail_url: course.thumbnail_url,
                totalLessons: courseTotalLessons,
                completedLessons: courseCompletedLessons,
                progressPercent,
                lastWatchedAt: lastWatched
            })
        }
    })

    // Sort by last watched
    recentCourses.sort((a, b) => {
        const timeA = a.lastWatchedAt ? new Date(a.lastWatchedAt).getTime() : 0
        const timeB = b.lastWatchedAt ? new Date(b.lastWatchedAt).getTime() : 0
        return timeB - timeA
    })

    const overallProgress = totalLessonsCount > 0
        ? Math.round((totalCompletedCount / totalLessonsCount) * 100)
        : 0

    return {
        user: {
            email: session.email || '',
            nickname: session.nickname || session.name || '',
            role: session.role || 'student'
        },
        stats: {
            enrolledCourses: recentCourses.length,
            totalProgress: overallProgress,
            certificates: 0 // TODO: Implement certificates
        },
        recentCourses
    }
}
