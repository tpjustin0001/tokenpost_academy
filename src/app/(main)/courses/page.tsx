/**
 * 강의 목록 페이지
 * 수강 가능한 모든 강의를 보여줍니다.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { getCourses } from '@/actions/courses'

function getAccessBadge(level: string) {
    switch (level) {
        case 'free':
            return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🆓 무료</Badge>
        case 'plus':
            return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">⭐ Plus</Badge>
        case 'alpha':
            return <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">👑 Alpha</Badge>
        default:
            return null
    }
}

export default async function CoursesPage() {
    const courses = await getCourses()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* 헤더 */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">강의 목록</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Web3 분야의 전문가들이 직접 설계한 커리큘럼으로 학습하세요.
                        실무에 바로 적용 가능한 지식을 얻을 수 있습니다.
                    </p>
                </div>

                {/* 강의 그리드 */}
                {courses.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <p className="text-xl">아직 등록된 강의가 없습니다.</p>
                        <p className="mt-2">곧 새로운 강의가 추가됩니다!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.filter(c => c.is_published).map((course) => (
                            <Link key={course.id} href={`/courses/${course.slug}`}>
                                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all hover:scale-[1.02] cursor-pointer h-full">
                                    {/* 썸네일 */}
                                    <div className="aspect-video bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-t-lg flex items-center justify-center overflow-hidden">
                                        {course.thumbnail_url ? (
                                            <img
                                                src={course.thumbnail_url}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-4xl">🎓</span>
                                        )}
                                    </div>

                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getAccessBadge(course.access_level)}
                                        </div>
                                        <CardTitle className="text-lg text-white line-clamp-2">
                                            {course.title}
                                        </CardTitle>
                                        <CardDescription className="text-slate-400 line-clamp-2">
                                            {course.description || '강의 설명이 없습니다.'}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm text-slate-500">
                                            <span>TokenPost Academy</span>
                                            <span>{new Date(course.created_at).toLocaleDateString('ko-KR')}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
