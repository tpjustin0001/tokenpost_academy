'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

import { getSession } from '@/lib/auth/session'

export async function getNote(lessonId: string) {
    const supabase = await createClient()
    const user = await getSession()

    if (!user) return null

    const { data, error } = await supabase
        .from('user_notes')
        .select('content')
        .eq('user_id', user.userId)
        .eq('lesson_id', lessonId)
        .single() // Expecting at most one note per lesson/user

    if (error) {
        // code 'PGRST116' is JSON object null (no rows found)
        if (error.code !== 'PGRST116') {
            console.error('Error fetching note:', error)
        }
        return null
    }

    return data?.content || ''
}

export async function saveNote(lessonId: string, content: string) {
    const supabase = await createClient()
    const user = await getSession()

    if (!user) throw new Error('Unauthorized')

    // Check if note exists
    const { data: existing } = await supabase
        .from('user_notes')
        .select('id')
        .eq('user_id', user.userId)
        .eq('lesson_id', lessonId)
        .single()

    if (existing) {
        // Update
        const { error } = await supabase
            .from('user_notes')
            .update({
                content,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)

        if (error) throw error
    } else {
        // Insert
        const { error } = await supabase
            .from('user_notes')
            .insert({
                user_id: user.userId,
                lesson_id: lessonId,
                content
            })

        if (error) throw error
    }

    // revalidatePath might not be needed if state is local, but good for consistency
}
