'use server'

/**
 * 강의 관련 Server Actions
 * Supabase와 통신하여 CRUD 수행
 */

import { createServerClient } from '@/lib/supabase/server'

export interface Course {
    id: string
    title: string
    slug: string
    description: string | null
    thumbnail_url: string | null
    access_level: 'free' | 'plus' | 'alpha'
    status: 'draft' | 'published' | 'archived'
    created_at: string
    updated_at: string
}

export interface CourseWithModules extends Course {
    modules: ModuleWithLessons[]
}

export interface Module {
    id: string
    course_id: string
    title: string
    position: number
    created_at: string
}

export interface ModuleWithLessons extends Module {
    lessons: Lesson[]
}

export interface Lesson {
    id: string
    module_id: string
    title: string
    vimeo_id: string | null
    duration: string | null
    access_level: 'free' | 'plus' | 'alpha'
    position: number
    is_published: boolean
    created_at: string
}

// ============ COURSES ============

export interface CourseWithStats extends Course {
    lessonsCount: number
    duration: string
    phase: number
}

export async function getCourses(): Promise<CourseWithStats[]> {
    try {
        const supabase = await createServerClient()

        const { data, error } = await supabase
            .from('courses')
            .select(`
                *,
                modules (
                    lessons (id)
                )
            `)
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching courses:', error)
            return []
        }

        if (!data) return []

        // Map to include lessonsCount
        return data.map((course: any) => ({
            ...course,
            lessonsCount: course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0,
            duration: '준비 중',
            phase: 1
        }))
    } catch (err) {
        console.error('Unexpected error in getCourses:', err)
        return []
    }
}

export async function getCourseBySlug(slug: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('courses')
        .select(`
            *,
            modules (
                *,
                lessons (*)
            )
        `)
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching course:', error)
        return null
    }

    // Sort modules and lessons by position
    if (data?.modules) {
        data.modules.sort((a: Module, b: Module) => a.position - b.position)
        data.modules.forEach((module: ModuleWithLessons) => {
            if (module.lessons) {
                module.lessons.sort((a: Lesson, b: Lesson) => a.position - b.position)
            }
        })
    }

    return data as CourseWithModules
}

export async function getCourseById(id: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('courses')
        .select(`
            *,
            modules (
                *,
                lessons (*)
            )
        `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching course:', error)
        return null
    }

    // Sort modules and lessons by position
    if (data?.modules) {
        data.modules.sort((a: Module, b: Module) => a.position - b.position)
        data.modules.forEach((module: ModuleWithLessons) => {
            if (module.lessons) {
                module.lessons.sort((a: Lesson, b: Lesson) => a.position - b.position)
            }
        })
    }

    return data as CourseWithModules
}

export async function createCourse(data: {
    title: string
    slug: string
    description?: string
    access_level?: 'free' | 'plus' | 'alpha'
}) {
    const supabase = await createServerClient()

    const { data: course, error } = await supabase
        .from('courses')
        .insert({
            title: data.title,
            slug: data.slug,
            description: data.description || null,
            access_level: data.access_level || 'plus',
            status: 'draft'
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating course:', error)
        return { success: false, error: error.message }
    }

    return { success: true, course }
}

export async function updateCourse(id: string, data: Partial<Course>) {
    const supabase = await createServerClient()

    const { error } = await supabase
        .from('courses')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) {
        console.error('Error updating course:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

export async function deleteCourse(id: string) {
    const supabase = await createServerClient()

    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting course:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

// ============ MODULES ============

export async function createModule(courseId: string, title: string) {
    const supabase = await createServerClient()

    // Get max position
    const { data: existing } = await supabase
        .from('modules')
        .select('position')
        .eq('course_id', courseId)
        .order('position', { ascending: false })
        .limit(1)

    const position = existing?.[0]?.position ?? -1

    const { data: module, error } = await supabase
        .from('modules')
        .insert({
            course_id: courseId,
            title,
            position: position + 1
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating module:', error)
        return { success: false, error: error.message }
    }

    return { success: true, module }
}

export async function updateModule(id: string, title: string) {
    const supabase = await createServerClient()

    const { error } = await supabase
        .from('modules')
        .update({ title })
        .eq('id', id)

    if (error) {
        console.error('Error updating module:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

export async function deleteModule(id: string) {
    const supabase = await createServerClient()

    const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting module:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

// ============ LESSONS ============

export async function createLesson(moduleId: string, data: {
    title: string
    vimeo_id?: string
    duration?: string
    access_level?: 'free' | 'plus' | 'alpha'
}) {
    const supabase = await createServerClient()

    // Get max position
    const { data: existing } = await supabase
        .from('lessons')
        .select('position')
        .eq('module_id', moduleId)
        .order('position', { ascending: false })
        .limit(1)

    const position = existing?.[0]?.position ?? -1

    const { data: lesson, error } = await supabase
        .from('lessons')
        .insert({
            module_id: moduleId,
            title: data.title,
            vimeo_id: data.vimeo_id || null,
            duration: data.duration || null,
            access_level: data.access_level || 'plus',
            position: position + 1,
            is_published: false
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating lesson:', error)
        return { success: false, error: error.message }
    }

    return { success: true, lesson }
}

export async function updateLesson(id: string, data: Partial<Lesson>) {
    const supabase = await createServerClient()

    const { error } = await supabase
        .from('lessons')
        .update(data)
        .eq('id', id)

    if (error) {
        console.error('Error updating lesson:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

export async function deleteLesson(id: string) {
    const supabase = await createServerClient()

    const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting lesson:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}
