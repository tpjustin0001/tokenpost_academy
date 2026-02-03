'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 레벨 계산 로직 (예: 100포인트마다 레벨업)
function calculateLevel(points: number) {
    if (points < 100) return 1
    if (points < 300) return 2
    if (points < 600) return 3
    if (points < 1000) return 4
    return 5 // Max Level
}

export async function getUserGamification() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116: uses result contained 0 rows
        console.error('Error fetching gamification data:', error)
        return null
    }

    // 데이터가 없으면 초기화
    if (!data) {
        const { data: newData, error: initError } = await supabase
            .from('user_points')
            .insert({ user_id: user.id, points: 0, level: 1 })
            .select()
            .single()

        if (initError) return null
        return newData
    }

    return data
}

export async function awardPoints(userId: string, points: number, action: string) {
    const supabase = await createClient()

    // 1. 현재 포인트 조회
    const { data: currentData } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .single()

    const currentPoints = currentData?.points || 0
    const newPoints = currentPoints + points
    const newLevel = calculateLevel(newPoints)

    // 2. 트랜잭션 기록
    await supabase.from('point_transactions').insert({
        user_id: userId,
        points,
        action
    })

    // 3. 포인트 및 레벨 업데이트
    if (currentData) {
        await supabase
            .from('user_points')
            .update({
                points: newPoints,
                level: newLevel,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
    } else {
        await supabase
            .from('user_points')
            .insert({
                user_id: userId,
                points: newPoints,
                level: newLevel
            })
    }

    revalidatePath('/')
    revalidatePath('/dashboard')

    return { success: true, newPoints, newLevel, leveledUp: newLevel > (currentData?.level || 1) }
}
