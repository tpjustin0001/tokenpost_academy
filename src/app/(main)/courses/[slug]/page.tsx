import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { getCourseBySlug } from '@/actions/courses'

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
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                {/* Background Pattern */}
                <div className="fixed inset-0 opacity-30 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/40 via-transparent to-transparent dark:from-blue-900/20" />
                </div>

                {/* Header */}
                <header className="sticky top-0 left-0 right-0 h-16 backdrop-blur-xl bg-background/80 border-b border-border z-30">
                    <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/courses" className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition">
                                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <Link href="/" className="flex items-center gap-2">
                                <div className="relative w-8 h-8">
                                    <Image
                                        src="/images/tokenpost-emblem.png"
                                        alt="TokenPost Academy"
                                        fill
                                        className="object-contain"
                                    />
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
                                <h1 className="text-4xl font-bold mb-4 text-foreground">{dbCourse.title}</h1>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    {dbCourse.description || '강의 설명이 없습니다.'}
                                </p>
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
                                <div className="sticky top-24 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 backdrop-blur shadow-sm dark:shadow-none">
                                    <div className="relative">
                                        <p className="text-2xl font-bold mb-2">멤버십 전용</p>
                                        <p className="text-sm text-muted-foreground mb-6">토큰포스트 멤버십 회원 무제한 시청</p>

                                        {firstLesson && (
                                            <Link href={`/courses/${slug}/lesson/${firstLesson.id}`}>
                                                <Button className="w-full mb-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg text-white">
                                                    강의 시작하기
                                                </Button>
                                            </Link>
                                        )}
                                        <a href="https://www.tokenpost.kr/membership" target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" className="w-full border-slate-200 dark:border-white/10 text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5">
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
                                <span className="text-sm text-muted-foreground">{allLessons.length}개 강의</span>
                            </div>

                            <div className="space-y-4">
                                <Accordion type="multiple" className="w-full space-y-4" defaultValue={dbCourse.modules?.map((m, i) => `item-${i}`)}>
                                    {dbCourse.modules?.map((module, moduleIndex) => (
                                        <AccordionItem key={module.id} value={`item-${moduleIndex}`} className="rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 overflow-hidden px-0">
                                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-100 dark:hover:bg-white/5 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-white/5 text-foreground">
                                                <div className="flex items-center justify-between w-full mr-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-400">
                                                            {moduleIndex + 1}
                                                        </span>
                                                        <h3 className="font-semibold text-left">{module.title}</h3>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground font-normal">{module.lessons?.length || 0}개 강의</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-0">
                                                <div className="border-t border-slate-200 dark:border-white/5">
                                                    {module.lessons?.map((lesson, lessonIndex) => (
                                                        <Link
                                                            key={lesson.id}
                                                            href={`/courses/${slug}/lesson/${lesson.id}`}
                                                            className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition border-b border-slate-100 dark:border-white/5 last:border-0"
                                                        >
                                                            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xs text-muted-foreground">
                                                                {lessonIndex + 1}
                                                            </span>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-foreground truncate">{lesson.title}</span>
                                                                    {lesson.access_level === 'free' && (
                                                                        <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                                                            무료
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-sm text-muted-foreground flex-shrink-0">{lesson.duration || '-'}</span>
                                                            <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        )
    }

    // 3) Supabase에 없으면 404
    if (!dbCourse) {
        notFound()
    }

    return null // Should not reach here
}
