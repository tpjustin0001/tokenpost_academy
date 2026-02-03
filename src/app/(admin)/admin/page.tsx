/**
 * Admin 대시보드
 * 주요 지표 및 최근 활동 개요
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

async function getDashboardStats() {
    const supabase = await createClient()

    // 통계 쿼리 병렬 실행
    const [
        { count: totalUsers },
        { count: totalCourses },
        { data: recentUsers }
    ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('nickname, email, created_at').order('created_at', { ascending: false }).limit(5)
    ])

    return {
        totalUsers: totalUsers || 0,
        totalCourses: totalCourses || 0,
        recentUsers: recentUsers || []
    }
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats()

    return (
        <div className="p-6 space-y-6">
            {/* 페이지 헤더 */}
            <div>
                <h1 className="text-3xl font-bold text-white">대시보드</h1>
                <p className="text-slate-400 mt-1">TokenPost Academy 관리자 현황</p>
            </div>

            {/* 통계 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="총 회원수"
                    value={stats.totalUsers.toLocaleString()}
                    icon="👥"
                />
                <StatCard
                    title="강의 수"
                    value={stats.totalCourses.toString()}
                    icon="📚"
                />
                <StatCard
                    title="모듈 수"
                    value="-"
                    icon="📑"
                />
                <StatCard
                    title="레슨 수"
                    value="-"
                    icon="🎬"
                />
            </div>

            {/* 최근 가입 회원 */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">최근 가입 회원</CardTitle>
                    <CardDescription className="text-slate-400">
                        최근 가입한 사용자 목록
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {stats.recentUsers.length === 0 ? (
                        <div className="py-8 text-center text-slate-400">
                            아직 가입한 회원이 없습니다
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats.recentUsers.map((user: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-medium">
                                            {(user.nickname || user.email)?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{user.nickname || '이름 없음'}</p>
                                            <p className="text-sm text-slate-400">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-slate-500">
                                        {new Date(user.created_at).toLocaleDateString('ko-KR')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function StatCard({
    title,
    value,
    icon,
}: {
    title: string
    value: string
    icon: string
}) {
    return (
        <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <span className="text-2xl">{icon}</span>
                </div>
                <div className="mt-4">
                    <p className="text-3xl font-bold text-white">{value}</p>
                    <p className="text-sm text-slate-400 mt-1">{title}</p>
                </div>
            </CardContent>
        </Card>
    )
}
