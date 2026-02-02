'use client'

/**
 * 강의실 (Classroom) 페이지 - 프리미엄 디자인
 */

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { VimeoPlayer, VideoPlaceholder } from '@/components/player/VimeoPlayer'
import { Button } from '@/components/ui/button'
import { getCourseBySlug, Lesson } from '@/data/courses'

export default function ClassroomPage() {
    const params = useParams()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const [hasAccess, setHasAccess] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const courseSlug = params.slug as string
    const lessonId = params.lessonId as string

    const course = getCourseBySlug(courseSlug)
    const allLessons = course?.sections.flatMap(s => s.lessons) || []
    const currentLesson = allLessons.find(l => l.id === lessonId)
    const currentIndex = allLessons.findIndex(l => l.id === lessonId)
    const isFreePreview = currentLesson?.isFreePreview || false

    const totalLessons = allLessons.length
    const completedLessons = allLessons.filter(l => l.isCompleted).length
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    useEffect(() => {
        // 개발 모드: 항상 접근 허용
        setHasAccess(true)
        setIsLoading(false)
    }, [lessonId, isFreePreview])

    const handleTimeUpdate = (current: number, total: number) => {
        if (total > 0) {
            setProgress(Math.round((current / total) * 100))
        }
    }

    const handleVideoEnded = () => {
        console.log('Lesson completed:', lessonId)
    }

    const navigateToLesson = (lesson: Lesson) => {
        router.push(`/courses/${courseSlug}/lesson/${lesson.id}`)
    }

    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    if (!course) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <p className="text-slate-400 mb-4">강의를 찾을 수 없습니다</p>
                    <Button onClick={() => router.push('/')}>홈으로 돌아가기</Button>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <Button onClick={() => router.back()}>돌아가기</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Background */}
            <div className="fixed inset-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
            </div>

            {/* Header */}
            <header className="sticky top-0 left-0 right-0 h-16 backdrop-blur-xl bg-slate-950/80 border-b border-white/5 z-30">
                <div className="h-full px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push(`/courses/${courseSlug}`)}
                            className="p-2 hover:bg-white/5 rounded-lg transition"
                        >
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20">
                                TP
                            </div>
                            <span className="font-semibold hidden sm:block">Academy</span>
                        </Link>
                        <div className="hidden md:block pl-4 border-l border-white/10">
                            <p className="text-sm text-slate-400 truncate max-w-xs">{course.title}</p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-sm text-slate-400">
                            {currentIndex + 1} / {totalLessons}
                        </div>
                        <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                                style={{ width: `${overallProgress}%` }}
                            />
                        </div>
                        <span className="text-sm text-slate-500">{overallProgress}%</span>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg transition lg:hidden"
                    >
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex min-h-[calc(100vh-4rem)]">
                {/* Video Area */}
                <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:mr-80 xl:mr-96' : ''}`}>
                    {/* Video Player */}
                    <div className="relative bg-black">
                        {isLoading ? (
                            <div className="aspect-video flex items-center justify-center">
                                <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : hasAccess && currentLesson?.vimeoId ? (
                            <VimeoPlayer
                                videoId={currentLesson.vimeoId}
                                autoplay
                            />
                        ) : (
                            <VideoPlaceholder />
                        )}
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 p-6 lg:p-8">
                        <div className="max-w-4xl">
                            {/* Title */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Phase {course.phase} · 레슨 {currentIndex + 1}
                                        </span>
                                        {isFreePreview && (
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                                                무료
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl font-semibold">
                                        {currentLesson?.title}
                                    </h1>
                                    {currentLesson?.titleEn && (
                                        <p className="text-sm text-slate-500 mt-1">{currentLesson.titleEn}</p>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {hasAccess && (
                                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-slate-400">현재 진행률</span>
                                        <span className="text-white font-medium">{progress}%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <Button
                                    variant="outline"
                                    disabled={!prevLesson}
                                    onClick={() => prevLesson && navigateToLesson(prevLesson)}
                                    className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    이전 강의
                                </Button>
                                <Button
                                    disabled={!nextLesson}
                                    onClick={() => nextLesson && navigateToLesson(nextLesson)}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-30"
                                >
                                    다음 강의
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curriculum Sidebar */}
                <aside className={`fixed top-16 right-0 bottom-0 w-80 xl:w-96 backdrop-blur-xl bg-black/40 border-l border-white/5 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                    <div className="h-full flex flex-col">
                        {/* Sidebar Header */}
                        <div className="p-4 border-b border-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-semibold">강의 목록</h2>
                                <span className="text-xs text-slate-500">{completedLessons}/{totalLessons} 완료</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                                    style={{ width: `${overallProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Lesson List */}
                        <div className="flex-1 overflow-y-auto">
                            {course.sections.map((section) => (
                                <div key={section.id}>
                                    <div className="px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider bg-white/[0.02] sticky top-0 backdrop-blur">
                                        {section.title}
                                    </div>
                                    {section.lessons.map((lesson) => {
                                        const lessonIndex = allLessons.findIndex(l => l.id === lesson.id)
                                        const isActive = lesson.id === lessonId

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => navigateToLesson(lesson)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/5 ${isActive ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-l-2 border-blue-500' : ''
                                                    }`}
                                            >
                                                {/* Status */}
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${lesson.isCompleted
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : isActive
                                                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20'
                                                        : 'bg-white/5 text-slate-500'
                                                    }`}>
                                                    {lesson.isCompleted ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        lessonIndex + 1
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className={`text-sm truncate ${isActive ? 'text-white font-medium' : 'text-slate-300'}`}>
                                                            {lesson.title}
                                                        </p>
                                                        {lesson.isFreePreview && (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                                                                무료
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5">{lesson.duration}</p>
                                                </div>

                                                {/* Playing indicator */}
                                                {isActive && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Membership CTA */}
                        {!hasAccess && (
                            <div className="p-4 border-t border-white/5 bg-gradient-to-t from-blue-900/20">
                                <p className="text-sm text-slate-400 mb-3">
                                    멤버십 회원만 시청할 수 있습니다
                                </p>
                                <a href="https://www.tokenpost.kr/membership" target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                                        멤버십 알아보기
                                    </Button>
                                </a>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    )
}
