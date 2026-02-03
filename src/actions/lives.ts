'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Live {
    id: string
    title: string
    description: string | null
    youtube_id: string
    thumbnail_url: string | null
    is_live: boolean
    scheduled_at: string
    duration: string | null
    view_count: number
    created_at: string
    updated_at: string
}

export interface CreateLiveInput {
    title: string
    description?: string
    youtube_id: string
    thumbnail_url?: string
    is_live?: boolean
    scheduled_at?: string
    duration?: string
}

// Get all lives
export async function getLives(): Promise<Live[]> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('lives')
        .select('*')
        .order('scheduled_at', { ascending: false })

    if (error) {
        console.error('Error fetching lives:', error)
        return []
    }

    return data || []
}

// Create a new live
export async function createLive(input: CreateLiveInput): Promise<{ success: boolean; error?: string; data?: Live }> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('lives')
        .insert({
            title: input.title,
            description: input.description || null,
            youtube_id: input.youtube_id,
            thumbnail_url: input.thumbnail_url || null,
            is_live: input.is_live ?? false,
            scheduled_at: input.scheduled_at || new Date().toISOString(),
            duration: input.duration || null,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating live:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/live')
    revalidatePath('/admin/lives')
    return { success: true, data }
}

// Update a live
export async function updateLive(id: string, input: Partial<CreateLiveInput>): Promise<{ success: boolean; error?: string }> {
    const supabase = createAdminClient()

    const { error } = await supabase
        .from('lives')
        .update({
            ...input,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating live:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/live')
    revalidatePath('/admin/lives')
    return { success: true }
}

// Delete a live
export async function deleteLive(id: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createAdminClient()

    const { error } = await supabase
        .from('lives')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting live:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/live')
    revalidatePath('/admin/lives')
    return { success: true }
}

// Toggle live status
export async function toggleLiveStatus(id: string, isLive: boolean): Promise<{ success: boolean; error?: string }> {
    return updateLive(id, { is_live: isLive })
}
