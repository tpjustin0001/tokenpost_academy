'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function getCoursesWithModules() {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('courses')
        .select(`
            *,
            modules (
                id,
                title,
                position,
                lessons (
                    id,
                    title,
                    duration,
                    access_level,
                    position
                )
            )
        `)
        .eq('status', 'published')  // Only show published courses
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching courses with modules:', error)
        return []
    }

    // 모듈 및 레슨 정렬
    const sortedData = data.map((course: any) => ({
        ...course,
        modules: course.modules
            ?.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
            .map((module: any) => ({
                ...module,
                lessons: module.lessons?.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
            }))
    }))

    return sortedData
}
