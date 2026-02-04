'use server'

/**
 * 강의 관련 Server Actions
 * Supabase와 통신하여 CRUD 수행
 */

import { createClient, createStaticClient, createAdminClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'
import { checkSubscriptionStatus } from '@/lib/auth/subscription'

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
    vimeo_embed_url: string | null
    duration: string | null
    description: string | null
    thumbnail_url: string | null
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
    modules: {
        id: string
        title: string
        position: number
        lessons: {
            id: string
            title: string
            position: number
            duration: string | null
        }[]
    }[]
}

// Helper to sum durations like "10:30" format
function sumDurations(lessons: { duration: string | null }[]): string {
    let totalSeconds = 0
    for (const lesson of lessons) {
        if (lesson.duration) {
            const parts = lesson.duration.split(':').map(Number)
            if (parts.length === 2) {
                totalSeconds += parts[0] * 60 + parts[1]
            } else if (parts.length === 3) {
                totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2]
            }
        }
    }
    if (totalSeconds === 0) return '준비 중'
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    if (hours > 0) {
        return `${hours}시간 ${minutes}분`
    }
    return `${minutes}분`
}

export async function getCourses(): Promise<CourseWithStats[]> {
    try {
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
                        position,
                        duration
                    )
                )
            `)
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching courses:', JSON.stringify(error, null, 2))
            return []
        }

        if (!data) return []

        // Sort modules and lessons
        const sortedData = data.map((course: any) => {
            // Sort modules
            if (course.modules) {
                course.modules.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))

                // Sort lessons in each module
                course.modules.forEach((module: any) => {
                    if (module.lessons) {
                        module.lessons.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
                    }
                })
            }
            return course
        })

        // Map to include lessonsCount and dynamic phase with real duration
        return sortedData.map((course: any, index: number) => {
            const allLessons = course.modules?.flatMap((m: any) => m.lessons || []) || []
            return {
                ...course,
                lessonsCount: allLessons.length,
                duration: sumDurations(allLessons),
                phase: index + 1
            }
        })
    } catch (err) {
        console.error('Unexpected error in getCourses:', err)
        return []
    }
}

export async function getCourseBySlug(slug: string) {
    const supabase = await createClient()

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
        // PGRST116: JSON object requested, multiple (or no) rows returned
        if (error.code !== 'PGRST116') {
            console.error('Error fetching course:', error)
        }
        return null
    }

    // Sort modules and lessons by position
    if (data?.modules) {
        // Check if user is admin via Session (robust check)
        const session = await getSession()
        const userGrade = session?.grade
        const subStatus = await checkSubscriptionStatus(userGrade)
        const isAdmin = session?.role === 'admin' || subStatus.grade === 'admin'

        // Determine user weight based on unified status
        let userWeight = 0
        if (isAdmin) {
            userWeight = 999 // Admin sees everything
        } else if (subStatus.grade?.toLowerCase().includes('alpha')) {
            userWeight = 2
        } else if (subStatus.isSubscriber) {
            userWeight = 1 // Any subscriber is at least 'plus' level
        }

        const levelWeight = { 'free': 0, 'plus': 1, 'alpha': 2 }

        data.modules.sort((a: Module, b: Module) => a.position - b.position)
        data.modules.forEach((module: ModuleWithLessons) => {
            if (module.lessons) {
                module.lessons.sort((a: Lesson, b: Lesson) => a.position - b.position)

                // Scrubbing Logic
                module.lessons.forEach((lesson: Lesson) => {
                    const requiredLevel = lesson.access_level || 'plus'
                    const contentWeight = levelWeight[requiredLevel as keyof typeof levelWeight] || 1

                    if (userWeight < contentWeight) {
                        // SCRUB DATA
                        lesson.vimeo_id = null
                        lesson.vimeo_embed_url = null
                        // Keep title, description, thumbnail for display
                    }
                })
            }
        })
    }
    return data as CourseWithModules
}

// --- Admin Dedicated Action to bypass all scrubbing ---
// --- Admin Dedicated Action to bypass all scrubbing ---
export async function getAdminCourseById(id: string) {
    // Use Admin Client (Service Role) to bypass RLS and Cookies
    const supabase = createAdminClient()

    try {
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
            console.error('Error fetching admin course:', error)
            return null
        }

        if (data?.modules && Array.isArray(data.modules)) {
            data.modules.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
            data.modules.forEach((module: any) => {
                if (module.lessons && Array.isArray(module.lessons)) {
                    module.lessons.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
                    // NO SCRUBBING HERE - Admin sees all raw inputs
                }
            })
        }
        return data as CourseWithModules
    } catch (err) {
        console.error('Unexpected error in getAdminCourseById:', err)
        return null
    }
}

export async function getCourseById(id: string) {
    const supabase = await createClient()

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
        // Check if user is admin via Session (robust check)
        const session = await getSession()
        const userGrade = session?.grade
        const subStatus = await checkSubscriptionStatus(userGrade)
        const isAdmin = session?.role === 'admin' || subStatus.grade === 'admin'

        // Determine user weight based on unified status
        let userWeight = 0
        if (isAdmin) {
            userWeight = 999 // Admin sees everything
        } else if (subStatus.grade?.toLowerCase().includes('alpha')) {
            userWeight = 2
        } else if (subStatus.isSubscriber) {
            userWeight = 1 // Any subscriber is at least 'plus' level
        }

        const levelWeight = { 'free': 0, 'plus': 1, 'alpha': 2 }

        data.modules.sort((a: Module, b: Module) => a.position - b.position)
        data.modules.forEach((module: ModuleWithLessons) => {
            if (module.lessons) {
                module.lessons.sort((a: Lesson, b: Lesson) => a.position - b.position)

                // Scrubbing Logic
                module.lessons.forEach((lesson: Lesson) => {
                    const requiredLevel = lesson.access_level || 'plus'
                    const contentWeight = levelWeight[requiredLevel as keyof typeof levelWeight] || 1

                    if (userWeight < contentWeight) {
                        // SCRUB DATA
                        lesson.vimeo_id = null
                        lesson.vimeo_embed_url = null
                    }
                })
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
    const supabase = await createClient()

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
    const supabase = await createClient()

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
    const supabase = await createClient()

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
    const supabase = await createClient()

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
    const supabase = await createClient()

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
    const supabase = await createClient()

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
    vimeo_embed_url?: string
    duration?: string
    description?: string
    thumbnail_url?: string
    access_level?: 'free' | 'plus' | 'alpha'
}) {
    const supabase = await createClient()

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
            vimeo_embed_url: data.vimeo_embed_url || null,
            duration: data.duration || null,
            description: data.description || null,
            thumbnail_url: data.thumbnail_url || null,
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
    const supabase = await createClient()

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
    const supabase = await createClient()

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
