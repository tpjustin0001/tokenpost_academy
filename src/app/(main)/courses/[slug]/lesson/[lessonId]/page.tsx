'use client'

/**
 * 강의실 (Classroom) 페이지 - TokenPost Academy 단일 브랜드
 */

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { VideoPlayer } from '@/components/player/VideoPlayer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getVideoToken } from '@/actions/stream'
import { SubscriptionPrompt, VideoPlaceholder } from '@/components/auth/SubscriptionPrompt'

interface Lesson {
    id: string
    title: string
    duration: string
    isCompleted?: boolean
    isFreePreview?: boolean
}

interface Module {
    id: string
    title: string
    lessons: Lesson[]
}

const MOCK_CURRICULUM: Module[] = [
    {
        id: 'module-1',
        title: '블록체인 기초',
        lessons: [
            { id: 'lesson-1', title: '블록체인이란 무엇인가?', duration: '15:30', isCompleted: true, isFreePreview: true },
            { id: 'lesson-2', title: '탈중앙화의 의미', duration: '12:45', isCompleted: true },
            { id: 'lesson-3', title: '합의 알고리즘 이해하기', duration: '18:20', isCompleted: false },
        ],
    },
    {
        id: 'module-2',
        title: '스마트 컨트랙트',
        lessons: [
            { id: 'lesson-4', title: '스마트 컨트랙트 개념', duration: '14:00', isCompleted: false },
            { id: 'lesson-5', title: 'Solidity 기초 문법', duration: '22:15', isCompleted: false },
            { id: 'lesson-6', title: '첫 번째 컨트랙트 작성하기', duration: '25:30', isCompleted: false },
        ],
    },
]

const MOCK_LESSON = {
    id: 'lesson-3',
    title: '합의 알고리즘 이해하기',
    description: 'PoW, PoS, DPoS 등 주요 합의 알고리즘의 작동 원리를 알아봅니다.',
    videoToken: 'mock-video-token',
}

export default function ClassroomPage() {
    const params = useParams()
    const router = useRouter()
    const [videoToken, setVideoToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false)
    const [hasAccess, setHasAccess] = useState(false)

    const courseSlug = params.slug as string
    const lessonId = params.lessonId as string

    const allLessons = MOCK_CURRICULUM.flatMap(m => m.lessons)
    const currentLesson = allLessons.find(l => l.id === lessonId)
    const currentIndex = allLessons.findIndex(l => l.id === lessonId)
    const isFreePreview = currentLesson?.isFreePreview || false

    const totalLessons = allLessons.length
    const completedLessons = allLessons.filter(l => l.isCompleted).length
    const overallProgress = Math.round((completedLessons / totalLessons) * 100)

    useEffect(() => {
        async function checkAccessAndGetToken() {
            try {
                setIsLoading(true)
                setError(null)

                const mockSubscriber = document.cookie.includes('mock-subscriber')

                if (isFreePreview || mockSubscriber) {
                    setHasAccess(true)
                    const result = await getVideoToken(lessonId)
                    if (result.success && result.token) {
                        setVideoToken(result.token)
                    } else {
                        setVideoToken(MOCK_LESSON.videoToken)
                    }
                } else {
                    setHasAccess(false)
                    setShowSubscriptionPrompt(true)
                }
            } catch (err) {
                console.error('Failed to check access:', err)
                setError('영상을 불러올 수 없습니다.')
            } finally {
                setIsLoading(false)
            }
        }
        checkAccessAndGetToken()
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

    if (error) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <Button onClick={() => router.back()}>돌아가기</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white">
            {showSubscriptionPrompt && (
                <SubscriptionPrompt onClose={() => setShowSubscriptionPrompt(false)} />
            )}

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f]/95 backdrop-blur border-b border-white/10 z-50 flex items-center px-4">
                <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => router.push(`/courses/${courseSlug}`)} className="p-2 hover:bg-white/10 rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                            TP
                        </div>
                        <span className="font-semibold hidden sm:block">TokenPost Academy</span>
                    </Link>
                </div>

                {/* Progress indicator */}
                <div className="hidden md:flex items-center gap-3 text-sm text-gray-400">
                    <span>{currentIndex + 1} / {totalLessons}</span>
                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all" style={{ width: `${overallProgress}%` }} />
                    </div>
                    <span>{overallProgress}%</span>
                </div>

                <div className="flex-1 flex justify-end">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            내 학습
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Layout */}
            <div className="pt-14 flex flex-col lg:flex-row min-h-screen">
                {/* Video Area */}
                <div className="flex-1">
                    {/* Video Player */}
                    <div className="w-full bg-black aspect-video lg:aspect-auto lg:h-[calc(100vh-56px-120px)]">
                        {isLoading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : hasAccess && videoToken ? (
                            <VideoPlayer
                                token={videoToken}
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={handleVideoEnded}
                                autoplay
                            />
                        ) : (
                            <VideoPlaceholder />
                        )}
                    </div>

                    {/* Video Info Bar */}
                    <div className="p-4 lg:p-6 border-t border-white/10 bg-[#0f0f0f]">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    {isFreePreview && (
                                        <Badge className="bg-green-500/20 text-green-400 text-xs">무료 공개</Badge>
                                    )}
                                    <span className="text-xs text-gray-500">레슨 {currentIndex + 1}</span>
                                </div>
                                <h1 className="text-xl font-bold">{currentLesson?.title || MOCK_LESSON.title}</h1>
                                <p className="text-sm text-gray-400 mt-1">{MOCK_LESSON.description}</p>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!prevLesson}
                                    onClick={() => prevLesson && navigateToLesson(prevLesson)}
                                    className="border-white/20"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    이전
                                </Button>
                                <Button
                                    size="sm"
                                    disabled={!nextLesson}
                                    onClick={() => nextLesson && navigateToLesson(nextLesson)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    다음
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {hasAccess && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                    <span>현재 레슨 진행률</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-1" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Curriculum Sidebar */}
                <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#141414]">
                    <div className="sticky top-14 h-[calc(100vh-56px)] overflow-hidden flex flex-col">
                        {/* Sidebar Header */}
                        <div className="p-4 border-b border-white/10 flex-shrink-0">
                            <h2 className="font-semibold mb-2">강의 목록</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span>{completedLessons}/{totalLessons} 완료</span>
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 transition-all" style={{ width: `${overallProgress}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Lesson List */}
                        <div className="flex-1 overflow-y-auto">
                            {MOCK_CURRICULUM.map((module) => (
                                <div key={module.id}>
                                    <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-white/5 sticky top-0">
                                        {module.title}
                                    </div>
                                    {module.lessons.map((lesson) => {
                                        const lessonIndex = allLessons.findIndex(l => l.id === lesson.id)
                                        const isActive = lesson.id === lessonId

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => navigateToLesson(lesson)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5 ${isActive ? 'bg-blue-500/10 border-l-2 border-blue-500' : ''}`}
                                            >
                                                {/* Status Icon */}
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${lesson.isCompleted
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : isActive
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-white/10 text-gray-500'
                                                    }`}>
                                                    {lesson.isCompleted ? '✓' : lessonIndex + 1}
                                                </div>

                                                {/* Lesson Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className={`text-sm truncate ${isActive ? 'text-white font-medium' : 'text-gray-300'}`}>
                                                            {lesson.title}
                                                        </p>
                                                        {lesson.isFreePreview && (
                                                            <Badge className="text-[10px] bg-green-500/20 text-green-400 px-1 py-0 flex-shrink-0">
                                                                무료
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">{lesson.duration}</p>
                                                </div>

                                                {/* Play Icon */}
                                                {isActive && (
                                                    <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Subscription CTA */}
                        {!hasAccess && (
                            <div className="p-4 border-t border-white/10 bg-gradient-to-t from-blue-900/20 flex-shrink-0">
                                <p className="text-sm text-gray-400 mb-3">
                                    토큰포스트 구독자만 시청할 수 있습니다
                                </p>
                                <a href="https://www.tokenpost.kr/subscribe" target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        구독하고 전체 강의 보기
                                    </Button>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
