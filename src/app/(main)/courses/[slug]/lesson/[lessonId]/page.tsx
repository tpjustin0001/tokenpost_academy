'use client'

/**
 * 강의실 (Classroom) 페이지 - 프리미엄 디자인
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { VimeoPlayer, VideoPlaceholder } from '@/components/player/VimeoPlayer'
import { Button } from '@/components/ui/button'
import { getCourseBySlug } from '@/actions/courses'
import { getLessonsProgress, saveProgress, markLessonComplete } from '@/actions/progress'
import { checkCurrentLessonAccess } from '@/actions/enrollment'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Award } from 'lucide-react'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'
import { getQuizForLesson } from '@/actions/quiz'
import { UserNotepad } from '@/components/note/UserNotepad'

export default function ClassroomPage() {
    const params = useParams()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [course, setCourse] = useState<any>(null)
    const [progress, setProgress] = useState(0) // Current video progress (0-100)
    const [hasAccess, setHasAccess] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [accessError, setAccessError] = useState<string | null>(null)
    const [quizData, setQuizData] = useState<{ quiz: any, questions: any[] } | null>(null)

    // Map of lessonId -> { progress, isCompleted }
    const [progressMap, setProgressMap] = useState<Record<string, { progress: number; isCompleted: boolean }>>({})

    // Save throttling
    const lastSaveTimeRef = useRef<number>(0)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const courseSlug = params.slug as string
    const lessonId = params.lessonId as string

    useEffect(() => {
        async function loadCourse() {
            try {
                setIsLoading(true)
                // Fetch from Server Action
                const data = await getCourseBySlug(courseSlug)
                if (!data) {
                    setError('강의를 찾을 수 없습니다')
                } else {
                    setCourse({
                        ...data,
                        phase: 1 // Default phase if missing
                    })

                    // Fetch Progress
                    // Extract all lesson IDs
                    const allLessonIds = data.modules?.flatMap((m: any) => m.lessons.map((l: any) => l.id)) || []
                    if (allLessonIds.length > 0) {
                        const progressResult = await getLessonsProgress(allLessonIds)
                        if (progressResult.success && progressResult.data) {
                            setProgressMap(progressResult.data)
                        }
                    }

                    // Check Access
                    const accessResult = await checkCurrentLessonAccess(lessonId)
                    setHasAccess(accessResult.hasAccess)
                    if (!accessResult.hasAccess) {
                        setAccessError(accessResult.reason || '권한이 없습니다.')
                    } else {
                        setAccessError(null)
                    }

                    // Fetch Quiz
                    const quizResult = await getQuizForLesson(lessonId)
                    setQuizData(quizResult)
                }
            } catch (err) {
                console.error(err)
                setError('강의 로딩 중 오류가 발생했습니다')
            } finally {
                setIsLoading(false)
            }
        }
        loadCourse()
    }, [courseSlug, lessonId]) // lessonId changes shouldn't necessarily reload course, but simplicity

    // Derive data from course state
    const allLessons = course?.modules?.flatMap((m: any) => m.lessons) || []
    const currentLesson = allLessons.find((l: any) => l.id === lessonId)
    const currentIndex = allLessons.findIndex((l: any) => l.id === lessonId)
    // const isFreePreview = currentLesson?.access_level === 'free'

    const totalLessons = allLessons.length
    // Calculate completed based on real data
    const completedLessons = allLessons.filter((l: any) => progressMap[l.id]?.isCompleted).length
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // Handlers
    const handleProgress = useCallback(async (percent: number, seconds: number, duration: number) => {
        // Update local progress bar for UX
        if (duration > 0) {
            setProgress(Math.round(percent))
        }

        // Throttle saving: Save at most every 5 seconds
        const now = Date.now()
        if (now - lastSaveTimeRef.current < 5000) return

        lastSaveTimeRef.current = now

        // Optimistic update map? Maybe too complex. Just save.
        await saveProgress({
            lessonId,
            currentTime: seconds,
            duration,
            completed: false
        })
    }, [lessonId])

    const handleLessonComplete = useCallback(async () => {
        // Mark as complete in backend
        await markLessonComplete(lessonId)

        // Update local state immediately
        setProgressMap(prev => ({
            ...prev,
            [lessonId]: {
                ...prev[lessonId],
                isCompleted: true,
                progress: 100
            }
        }))
    }, [lessonId])

    const navigateToLesson = (lesson: any) => {
        router.push(`/courses/${courseSlug}/lesson/${lesson.id}`)
    }

    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">강의실 입장 중...</p>
                </div>
            </div>
        )
    }

    if (!course || error) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <p className="text-slate-400 mb-4">{error || '강의를 찾을 수 없습니다'}</p>
                    <Button onClick={() => router.push('/')}>홈으로 돌아가기</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Background */}
            <div className="fixed inset-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/40 via-transparent to-transparent dark:from-blue-900/20" />
            </div>

            {/* Header */}
            <header className="sticky top-0 left-0 right-0 h-16 backdrop-blur-xl bg-background/80 border-b border-border z-30">
                <div className="h-full px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push(`/courses/${courseSlug}`)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition"
                        >
                            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
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
                        <div className="hidden md:block pl-4 border-l border-border">
                            <p className="text-sm text-muted-foreground truncate max-w-xs">{course.title}</p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                            {currentIndex + 1} / {totalLessons}
                        </div>
                        <div className="w-40 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                                style={{ width: `${overallProgress}%` }}
                            />
                        </div>
                        <span className="text-sm text-muted-foreground">{overallProgress}%</span>
                    </div>

                    {/* Sidebar Toggle (Mobile) - Hidden now as sidebar is always at bottom */}
                    {/* <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition lg:hidden"
                    >
                        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button> */}
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
                {/* Video Area */}
                <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:mr-80 xl:mr-96' : ''}`}>
                    {/* Video Player */}
                    <div className="relative bg-black aspect-video flex items-center justify-center">
                        {!hasAccess ? (
                            <div className="text-center p-8 bg-slate-900/80 rounded-xl border border-white/10 backdrop-blur">
                                <span className="text-4xl mb-4 block">🔒</span>
                                <h3 className="text-xl font-semibold mb-2 text-white">강의 시청 권한이 없습니다</h3>
                                <p className="text-slate-400 mb-6">{accessError || '로그인 후 이용해주세요'}</p>
                                <Button onClick={() => router.push('/login')} variant="secondary">
                                    로그인하기
                                </Button>
                            </div>
                        ) : currentLesson?.vimeo_id ? (
                            <VimeoPlayer
                                videoId={currentLesson.vimeo_id}
                                embedUrl={currentLesson.vimeo_embed_url}
                                autoplay
                                onProgress={handleProgress}
                                onEnded={handleLessonComplete}
                            />
                        ) : (
                            <VideoPlaceholder />
                        )}
                    </div>

                    {/* Content Area (Tabs) */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-4xl mx-auto p-6 lg:p-8">
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-8">
                                    <TabsTrigger value="overview">강의 개요</TabsTrigger>
                                    <TabsTrigger value="quiz" className="relative">
                                        퀴즈
                                        {quizData?.quiz && (
                                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                            </span>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="notes">강의 노트</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-6">
                                    {/* Title & Nav */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Phase {course.phase} · 레슨 {currentIndex + 1}
                                                </span>
                                                {/* Quiz Badge if exists */}
                                                {quizData?.quiz && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                        <Award className="w-3 h-3 mr-1" />
                                                        퀴즈 포함
                                                    </span>
                                                )}
                                            </div>
                                            <h1 className="text-2xl font-semibold text-foreground">
                                                {currentLesson?.title}
                                            </h1>
                                            {currentLesson?.description && (
                                                <p className="mt-4 text-muted-foreground leading-relaxed">
                                                    {currentLesson.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-border">
                                            <Button
                                                variant="outline"
                                                disabled={!prevLesson}
                                                onClick={() => prevLesson && navigateToLesson(prevLesson)}
                                                className="border-border text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                이전 강의
                                            </Button>
                                            <Button
                                                disabled={!nextLesson}
                                                onClick={() => nextLesson && navigateToLesson(nextLesson)}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-30 text-white"
                                            >
                                                다음 강의
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="quiz">
                                    {quizData?.quiz ? (
                                        <div className="max-w-2xl mx-auto">
                                            <QuizPlayer
                                                quizId={quizData.quiz.id}
                                                title="이번 레슨 퀴즈" // Quiz title if avail
                                                questions={quizData.questions}
                                                onComplete={() => {
                                                    // Refresh gamification?
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl bg-slate-50/50 dark:bg-white/5">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Award className="w-6 h-6 opacity-30" />
                                            </div>
                                            <p>이 레슨에는 퀴즈가 없습니다.</p>
                                            <p className="text-sm mt-1">다음 레슨으로 이동하여 학습을 계속하세요.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="notes">
                                    <UserNotepad lessonId={lessonId} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>

                {/* Curriculum Sidebar */}
                <aside className={`
                    w-full lg:w-80 xl:w-96 
                    backdrop-blur-xl bg-background/80 dark:bg-black/40 
                    border-t lg:border-t-0 lg:border-l border-border 
                    z-40 
                    lg:fixed lg:top-16 lg:right-0 lg:bottom-0 
                    lg:transition-transform lg:duration-300 
                    ${sidebarOpen ? 'lg:translate-x-0' : 'lg:translate-x-full'}
                `}>
                    <div className="h-[500px] lg:h-full flex flex-col">
                        {/* Sidebar Header */}
                        <div className="p-4 border-b border-border">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-semibold text-foreground">강의 목록</h2>
                                <span className="text-xs text-muted-foreground">{completedLessons}/{totalLessons} 완료</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                                    style={{ width: `${overallProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Lesson List */}
                        <div className="flex-1 overflow-y-auto">
                            {course.modules?.map((module: any) => (
                                <div key={module.id}>
                                    <div className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-slate-50/80 dark:bg-white/[0.02] sticky top-0 backdrop-blur">
                                        {module.title}
                                    </div>
                                    {module.lessons.map((lesson: any) => {
                                        const lessonIndex = allLessons.findIndex((l: any) => l.id === lesson.id)
                                        const isActive = lesson.id === lessonId
                                        const isCompleted = progressMap[lesson.id]?.isCompleted || false // Check progress map!

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => navigateToLesson(lesson)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-slate-100 dark:hover:bg-white/5 ${isActive ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 border-l-2 border-blue-500' : ''
                                                    }`}
                                            >
                                                {/* Status */}
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${isCompleted
                                                    ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                    : isActive
                                                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20'
                                                        : 'bg-slate-100 dark:bg-white/5 text-slate-500'
                                                    }`}>
                                                    {isCompleted ? (
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
                                                        <p className={`text-sm truncate ${isActive ? 'text-blue-600 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-300'}`}>
                                                            {lesson.title}
                                                        </p>
                                                        {lesson.access_level === 'free' && (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                                                무료
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{lesson.duration || '-'}</p>
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
                    </div>
                </aside>
            </div>
        </div>
    )
}
