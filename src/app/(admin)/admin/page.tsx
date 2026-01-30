/**
 * Admin 대시보드
 * 주요 지표 및 최근 활동 개요
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// TODO: Supabase에서 실제 데이터 조회
const MOCK_STATS = {
    totalUsers: 1234,
    totalCourses: 12,
    totalEnrollments: 3456,
    revenue: 15680000,
    recentEnrollments: [
        { id: 1, user: '김철수', course: '웹3 핵심 개념', date: '2024-01-30' },
        { id: 2, user: '이영희', course: 'DeFi 마스터클래스', date: '2024-01-30' },
        { id: 3, user: '박민수', course: 'NFT 개발 가이드', date: '2024-01-29' },
    ],
}

export default function AdminDashboard() {
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
                    value={MOCK_STATS.totalUsers.toLocaleString()}
                    icon="👥"
                    change="+12%"
                    changeType="positive"
                />
                <StatCard
                    title="강의 수"
                    value={MOCK_STATS.totalCourses.toString()}
                    icon="📚"
                    change="+2"
                    changeType="positive"
                />
                <StatCard
                    title="총 수강"
                    value={MOCK_STATS.totalEnrollments.toLocaleString()}
                    icon="📋"
                    change="+156"
                    changeType="positive"
                />
                <StatCard
                    title="총 매출"
                    value={`₩${(MOCK_STATS.revenue / 10000).toLocaleString()}만`}
                    icon="💰"
                    change="+8.5%"
                    changeType="positive"
                />
            </div>

            {/* 최근 수강 신청 */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">최근 수강 신청</CardTitle>
                    <CardDescription className="text-slate-400">
                        최근 등록된 수강 내역
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {MOCK_STATS.recentEnrollments.map((enrollment) => (
                            <div
                                key={enrollment.id}
                                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                            >
                                <div>
                                    <p className="text-white font-medium">{enrollment.user}</p>
                                    <p className="text-sm text-slate-400">{enrollment.course}</p>
                                </div>
                                <span className="text-sm text-slate-500">{enrollment.date}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function StatCard({
    title,
    value,
    icon,
    change,
    changeType,
}: {
    title: string
    value: string
    icon: string
    change: string
    changeType: 'positive' | 'negative'
}) {
    return (
        <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <span className="text-2xl">{icon}</span>
                    <span
                        className={`text-sm ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                            }`}
                    >
                        {change}
                    </span>
                </div>
                <div className="mt-4">
                    <p className="text-3xl font-bold text-white">{value}</p>
                    <p className="text-sm text-slate-400 mt-1">{title}</p>
                </div>
            </CardContent>
        </Card>
    )
}
