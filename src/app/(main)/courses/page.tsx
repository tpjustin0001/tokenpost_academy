/**
 * 강의 목록 페이지 - 카드 형식
 * 모든 과정을 카드 형태로 표시
 */

import Link from 'next/link'
import { getCoursesWithModules } from '@/actions/courses-unrolled'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function CoursesPage() {
    const courses = await getCoursesWithModules()

    return (
        <div className="min-h-screen bg-background py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* 헤더 */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">전체 강의</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        TokenPost Academy의 모든 커리큘럼을 단계별로 학습하세요.
                    </p>
                </div>

                {/* 카드 그리드 */}
                {courses.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p className="text-xl">등록된 강의가 없습니다.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course: any) => {
                            const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0
                            const totalModules = course.modules?.length || 0

                            return (
                                <Link href={`/courses/${course.slug}`} key={course.id}>
                                    <Card className="group h-full overflow-hidden border-slate-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 bg-white dark:bg-slate-900/50">
                                        {/* 썸네일 */}
                                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                            {course.thumbnail_url ? (
                                                <img
                                                    src={course.thumbnail_url}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                                                    <span className="text-5xl">🎓</span>
                                                </div>
                                            )}
                                            {/* 접근 레벨 배지 */}
                                            <div className="absolute top-3 left-3">
                                                <Badge
                                                    variant={course.access_level === 'free' ? 'default' : 'secondary'}
                                                    className={course.access_level === 'free'
                                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0'
                                                    }
                                                >
                                                    {course.access_level === 'free' ? '무료' : 'Plus'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="p-5">
                                            {/* 제목 */}
                                            <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                {course.title}
                                            </h2>

                                            {/* 설명 */}
                                            {course.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                    {course.description}
                                                </p>
                                            )}

                                            {/* 메타 정보 */}
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-slate-100 dark:border-white/5">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                    {totalModules}개 모듈
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {totalLessons}개 레슨
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
