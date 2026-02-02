import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCourseBySlug } from '@/actions/courses'
import { getCourseBySlug as getLocalCourse } from '@/data/courses'

// Phase 컬러 (로컬 데이터용)
const PHASE_COLORS = [
    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500' },
    { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
    { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
    { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
    { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-500' },
    { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
    { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-500' },
]

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

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    // 1) Supabase에서 먼저 조회 (modules + lessons 포함)
    const dbCourse = await getCourseBySlug(slug)

    // 2) Supabase에 있으면 DB 데이터 사용
    if (dbCourse) {
        const allLessons = dbCourse.modules?.flatMap(m => m.lessons) || []
        const firstLesson = allLessons[0]

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
                {/* Background */}
                <div className="fixed inset-0 opacity-30 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
                </div>

                {/* Header */}
                <header className="sticky top-0 left-0 right-0 h-16 backdrop-blur-xl bg-slate-950/80 border-b border-white/5 z-30">
                    <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/courses" className="p-2 hover:bg-white/5 rounded-lg transition">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20">
                                    TP
                                </div>
                                <span className="font-semibold hidden sm:block">Academy</span>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="relative py-8 px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Hero Section */}
                        <div className="grid lg:grid-cols-3 gap-8 mb-12">
                            <div className="lg:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    {getAccessBadge(dbCourse.access_level)}
                                </div>
                                <h1 className="text-4xl font-bold mb-4">{dbCourse.title}</h1>
                                <p className="text-slate-400 leading-relaxed mb-6">
                                    {dbCourse.description || '강의 설명이 없습니다.'}
                                </p>
                                <div className="flex items-center gap-6 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span>{allLessons.length}개 강의</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <span>{dbCourse.modules?.length || 0}개 섹션</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="relative">
                                <div className="sticky top-24 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur">
                                    <div className="relative">
                                        <p className="text-2xl font-bold mb-2">멤버십 전용</p>
                                        <p className="text-sm text-slate-400 mb-6">토큰포스트 멤버십 회원 무제한 시청</p>

                                        {firstLesson && (
                                            <Link href={`/courses/${slug}/lesson/${firstLesson.id}`}>
                                                <Button className="w-full mb-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg">
                                                    강의 시작하기
                                                </Button>
                                            </Link>
                                        )}
                                        <a href="https://www.tokenpost.kr/membership" target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" className="w-full border-white/10 text-slate-400 hover:text-white hover:bg-white/5">
                                                멤버십 알아보기
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Curriculum */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 rounded-full bg-blue-500" />
                                <h2 className="text-xl font-semibold">커리큘럼</h2>
                                <span className="text-sm text-slate-500">{allLessons.length}개 강의</span>
                            </div>

                            <div className="space-y-4">
                                {dbCourse.modules?.map((module, moduleIndex) => (
                                    <div key={module.id} className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden">
                                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-medium text-slate-400">
                                                    {moduleIndex + 1}
                                                </span>
                                                <h3 className="font-semibold">{module.title}</h3>
                                            </div>
                                            <span className="text-sm text-slate-500">{module.lessons?.length || 0}개 강의</span>
                                        </div>
                                        <div>
                                            {module.lessons?.map((lesson, lessonIndex) => (
                                                <Link
                                                    key={lesson.id}
                                                    href={`/courses/${slug}/lesson/${lesson.id}`}
                                                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition border-b border-white/5 last:border-0"
                                                >
                                                    <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-slate-500">
                                                        {lessonIndex + 1}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-slate-300 truncate">{lesson.title}</span>
                                                            {lesson.access_level === 'free' && (
                                                                <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400">
                                                                    무료
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-slate-500 flex-shrink-0">{lesson.duration || '-'}</span>
                                                    <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        )
    }

    // 3) Supabase에 없으면 로컬 Phase 데이터 확인
    const localCourse = getLocalCourse(slug)

    if (!localCourse) {
        notFound()
    }

    // 로컬 Phase 강의 렌더링
    const colors = PHASE_COLORS[localCourse.phase - 1] || PHASE_COLORS[0]
    const allLessons = localCourse.sections.flatMap(s => s.lessons)
    const firstLesson = allLessons[0]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Background */}
            <div className="fixed inset-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
            </div>

            {/* Header */}
            <header className="sticky top-0 left-0 right-0 h-16 backdrop-blur-xl bg-slate-950/80 border-b border-white/5 z-30">
                <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-white/5 rounded-lg transition">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20">
                                TP
                            </div>
                            <span className="font-semibold hidden sm:block">Academy</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="relative py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${colors.bg} ${colors.text}`}>
                                    Phase {localCourse.phase}
                                </span>
                                <span className="text-xs text-slate-500">{localCourse.level}</span>
                            </div>
                            <h1 className="text-4xl font-bold mb-2">{localCourse.title}</h1>
                            <p className="text-xl text-slate-400 mb-4">{localCourse.subtitle}</p>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                {localCourse.description}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{localCourse.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>{localCourse.lessonsCount}개 강의</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span>{localCourse.sections.length}개 섹션</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="relative">
                            <div className="sticky top-24 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur">
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${localCourse.gradient} opacity-5`} />
                                <div className="relative">
                                    <p className="text-2xl font-bold mb-2">멤버십 전용</p>
                                    <p className="text-sm text-slate-400 mb-6">토큰포스트 멤버십 회원 무제한 시청</p>

                                    {firstLesson && (
                                        <Link href={`/courses/${slug}/lesson/${firstLesson.id}`}>
                                            <Button className="w-full mb-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg">
                                                강의 시작하기
                                            </Button>
                                        </Link>
                                    )}
                                    <a href="https://www.tokenpost.kr/membership" target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="w-full border-white/10 text-slate-400 hover:text-white hover:bg-white/5">
                                            멤버십 알아보기
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Curriculum */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-1 h-6 rounded-full ${colors.dot}`} />
                            <h2 className="text-xl font-semibold">커리큘럼</h2>
                            <span className="text-sm text-slate-500">{allLessons.length}개 강의</span>
                        </div>

                        <div className="space-y-4">
                            {localCourse.sections.map((section, sectionIndex) => (
                                <div key={section.id} className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-medium text-slate-400">
                                                {sectionIndex + 1}
                                            </span>
                                            <h3 className="font-semibold">{section.title}</h3>
                                        </div>
                                        <span className="text-sm text-slate-500">{section.lessons.length}개 강의</span>
                                    </div>
                                    <div>
                                        {section.lessons.map((lesson, lessonIndex) => (
                                            <Link
                                                key={lesson.id}
                                                href={`/courses/${slug}/lesson/${lesson.id}`}
                                                className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition border-b border-white/5 last:border-0"
                                            >
                                                <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-slate-500">
                                                    {lessonIndex + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-300 truncate">{lesson.title}</span>
                                                        {lesson.isFreePreview && (
                                                            <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400">
                                                                무료
                                                            </span>
                                                        )}
                                                    </div>
                                                    {lesson.titleEn && (
                                                        <p className="text-xs text-slate-500 truncate mt-0.5">{lesson.titleEn}</p>
                                                    )}
                                                </div>
                                                <span className="text-sm text-slate-500 flex-shrink-0">{lesson.duration}</span>
                                                <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
