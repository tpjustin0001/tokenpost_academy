'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCoursesWithModules() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('courses')
        .select(`
            *,
            modules (
                id,
                title,
                order_index,
                lessons (
                    id,
                    title,
                    duration,
                    access_level,
                    order_index
                )
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching courses with modules:', error)
        return []
    }

    // 모듈 및 레슨 정렬
    const sortedData = data.map((course: any) => ({
        ...course,
        modules: course.modules
            ?.sort((a: any, b: any) => a.order_index - b.order_index)
            .map((module: any) => ({
                ...module,
                lessons: module.lessons?.sort((a: any, b: any) => a.order_index - b.order_index)
            }))
    }))

    return sortedData
}
