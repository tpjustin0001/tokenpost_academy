'use server'

/**
 * 사용자 관리 Server Actions
 * Supabase와 통신하여 사용자 CRUD 수행
 */

import { createAdminClient } from '@/lib/supabase/server'

export interface User {
    id: string
    tp_uid: string | null
    email: string
    nickname: string | null
    profile_image: string | null
    subscription_level: 'free' | 'plus' | 'alpha'
    subscription_expires_at: string | null
    role: 'student' | 'admin'
    is_banned: boolean
    ban_reason: string | null
    last_login_at: string | null
    created_at: string
    updated_at: string
}

interface GetUsersFilters {
    subscription_level?: 'free' | 'plus' | 'alpha'
    role?: 'student' | 'admin'
    search?: string
    limit?: number
    offset?: number
}

// ============ USERS ============

export async function getUsers(filters?: GetUsersFilters) {
    const supabase = createAdminClient()

    let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

    if (filters?.subscription_level) {
        query = query.eq('subscription_level', filters.subscription_level)
    }
    if (filters?.role) {
        query = query.eq('role', filters.role)
    }
    if (filters?.search) {
        query = query.or(`email.ilike.%${filters.search}%,nickname.ilike.%${filters.search}%`)
    }
    if (filters?.limit) {
        query = query.limit(filters.limit)
    }
    if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
    }

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching users:', error)
        return { users: [], count: 0 }
    }

    return { users: data as User[], count: count || 0 }
}

export async function syncUserFromAuth(userId: string, email: string) {
    const supabase = createAdminClient()

    // Check if exists
    const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

    if (existing) {
        // User already exists, update if necessary (e.g., email changed)
        if (existing.email !== email) {
            const { error } = await supabase
                .from('users')
                .update({ email, updated_at: new Date().toISOString() })
                .eq('id', userId)
            if (error) {
                console.error('Error updating user email during sync:', error)
                return { success: false, error: error.message }
            }
        }
        return { success: true, user: existing as User }
    } else {
        // User does not exist, create new entry
        const { data, error } = await supabase
            .from('users')
            .insert({
                id: userId,
                email: email,
                nickname: email.split('@')[0], // Default nickname from email
                subscription_level: 'free',
                role: 'student',
                is_banned: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating new user during sync:', error)
            return { success: false, error: error.message }
        }
        return { success: true, user: data as User }
    }
}

export async function getUserById(id: string) {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching user:', error)
        return null
    }

    return data as User
}

export async function updateUser(id: string, data: Partial<Pick<User, 'subscription_level' | 'role' | 'is_banned' | 'ban_reason'>>) {
    const supabase = createAdminClient()

    const { error } = await supabase
        .from('users')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) {
        console.error('Error updating user:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

export async function banUser(id: string, reason: string) {
    return updateUser(id, { is_banned: true, ban_reason: reason })
}

export async function unbanUser(id: string) {
    return updateUser(id, { is_banned: false, ban_reason: null })
}

export async function getUserStats() {
    const supabase = createAdminClient()

    const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

    const { count: plusUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_level', 'plus')

    const { count: alphaUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_level', 'alpha')

    return {
        total: totalUsers || 0,
        free: (totalUsers || 0) - (plusUsers || 0) - (alphaUsers || 0),
        plus: plusUsers || 0,
        alpha: alphaUsers || 0
    }
}
