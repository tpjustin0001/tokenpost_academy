
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
        <div className="min-h-screen bg-background py-12 px-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* 헤더 */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">내 학습</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        안녕하세요, <span className="font-medium text-foreground">{user.nickname || user.email.split('@')[0]}</span>님! 오늘도 학습을 시작해보세요.
                    </p>
                </div>

                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-muted-foreground">수강 중인 강의</CardDescription>
                            <CardTitle className="text-4xl font-bold text-foreground">{stats.enrolledCourses}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-muted-foreground">전체 진도율</CardDescription>
                            <CardTitle className="text-4xl font-bold text-foreground">{stats.totalProgress}%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                    style={{ width: `${stats.totalProgress}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-muted-foreground">획득 수료증</CardDescription>
                            <CardTitle className="text-4xl font-bold text-foreground">{stats.certificates}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                        </CardContent>
                    </Card>
                </div>

                {/* 내 강의 목록 */}
                <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-xl text-foreground">내 강의</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            현재 수강 중인 강의 목록입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentCourses.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="mb-4">아직 수강 중인 강의가 없습니다.</p>
                                <Link href="/courses">
                                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white">
                                        강의 둘러보기
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentCourses.map((course) => (
                                    <Link key={course.id} href={`/courses/${course.slug}`}>
                                        <div className="block p-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-slate-100 dark:border-white/5 group">
                                            <div className="flex items-start gap-4">
                                                {course.thumbnail_url && (
                                                    <div className="w-20 h-14 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                        {course.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        진도율: <span className="text-blue-600 dark:text-blue-400 font-medium">{course.progressPercent}%</span>
                                                        <span className="mx-1">·</span>
                                                        {course.completedLessons}/{course.totalLessons}강
                                                    </p>
                                                    <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
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
                <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-xl text-foreground">프로필 정보</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-0 divide-y divide-slate-100 dark:divide-white/5">
                        <div className="flex justify-between py-4">
                            <span className="text-muted-foreground">이메일</span>
                            <span className="text-foreground font-medium">{user.email}</span>
                        </div>
                        <div className="flex justify-between py-4">
                            <span className="text-muted-foreground">닉네임</span>
                            <span className="text-foreground font-medium">{user.nickname || '-'}</span>
                        </div>
                        <div className="flex justify-between py-4">
                            <span className="text-muted-foreground">회원 등급</span>
                            <span className="text-foreground font-medium capitalize">{user.role}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

