
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUserDashboardData } from '@/actions/dashboard'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const dashboardData = await getUserDashboardData()

    if (!dashboardData) {
        redirect('/login')
    }

    const { user, stats, recentCourses } = dashboardData

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* 헤더 */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">내 대시보드</h1>
                        <p className="text-slate-400 mt-1">
                            안녕하세요, {user.nickname || user.email.split('@')[0]}님!
                        </p>
                    </div>
                </div>

                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-slate-400">수강 중인 강의</CardDescription>
                            <CardTitle className="text-4xl font-bold text-white">{stats.enrolledCourses}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-slate-400">전체 진도율</CardDescription>
                            <CardTitle className="text-4xl font-bold text-white">{stats.totalProgress}%</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-slate-400">획득 수료증</CardDescription>
                            <CardTitle className="text-4xl font-bold text-white">{stats.certificates}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* 내 강의 목록 */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">내 강의</CardTitle>
                        <CardDescription className="text-slate-400">
                            수강 중인 강의 목록입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentCourses.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <p className="mb-4">아직 수강 중인 강의가 없습니다.</p>
                                <Link href="/courses">
                                    <Button>강의 둘러보기</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentCourses.map((course) => (
                                    <Link key={course.id} href={`/courses/${course.slug}`}>
                                        <div className="block p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-slate-600 group">
                                            <div className="flex items-start gap-4">
                                                {course.thumbnail_url && (
                                                    <div className="w-16 h-16 rounded-md bg-slate-600 overflow-hidden flex-shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                                                        {course.title}
                                                    </h4>
                                                    <p className="text-sm text-slate-400 mt-1">
                                                        진도율: <span className="text-blue-400 font-medium">{course.progressPercent}%</span>
                                                        ({course.completedLessons}/{course.totalLessons}강)
                                                    </p>
                                                    <div className="w-full bg-slate-600 h-1.5 rounded-full mt-2 overflow-hidden">
                                                        <div
                                                            className="bg-blue-500 h-full rounded-full"
                                                            style={{ width: `${course.progressPercent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 프로필 정보 */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">프로필 정보</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-slate-700">
                            <span className="text-slate-400">이메일</span>
                            <span className="text-white">{user.email}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700">
                            <span className="text-slate-400">닉네임</span>
                            <span className="text-white">{user.nickname || '-'}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-slate-400">회원 등급</span>
                            <span className="text-white capitalize">{user.role}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

