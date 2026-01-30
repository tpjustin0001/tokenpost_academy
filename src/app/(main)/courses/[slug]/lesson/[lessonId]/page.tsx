'use client'

/**
 * 강의실 (Classroom) 페이지
 * 영상 시청 + 커리큘럼 네비게이션
 * 
 * 접근 정책:
 * - 토큰포스트 구독자: 모든 영상 시청 가능
 * - 비구독자: 무료 프리뷰(lesson-1)만 시청 가능
 */

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { VideoPlayer } from '@/components/player/VideoPlayer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { getVideoToken } from '@/actions/stream'
import { SubscriptionPrompt, VideoPlaceholder } from '@/components/auth/SubscriptionPrompt'

interface Lesson {
    id: string
    title: string
    duration: string
    isCompleted?: boolean
    isCurrent?: boolean
    isFreePreview?: boolean
}

interface Module {
    id: string
    title: string
    lessons: Lesson[]
}

// TODO: Supabase에서 실제 데이터 조회로 대체
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
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false)
    const [hasAccess, setHasAccess] = useState(false)

    const courseSlug = params.slug as string
    const lessonId = params.lessonId as string

    // 현재 레슨이 무료 프리뷰인지 확인
    const currentLesson = MOCK_CURRICULUM.flatMap(m => m.lessons).find(l => l.id === lessonId)
    const isFreePreview = currentLesson?.isFreePreview || false

    // 전체 진도율 계산
    const totalLessons = MOCK_CURRICULUM.reduce((acc, m) => acc + m.lessons.length, 0)
    const completedLessons = MOCK_CURRICULUM.reduce(
        (acc, m) => acc + m.lessons.filter(l => l.isCompleted).length,
        0
    )
    const overallProgress = Math.round((completedLessons / totalLessons) * 100)

    useEffect(() => {
        async function checkAccessAndGetToken() {
            try {
                setIsLoading(true)
                setError(null)

                // TODO: 실제 세션에서 사용자 정보 가져오기
                // 현재는 쿠키에서 mock 세션 확인
                const mockSession = document.cookie.includes('mock-session')
                const mockSubscriber = document.cookie.includes('mock-subscriber')

                // 무료 프리뷰거나 구독자인 경우 접근 허용
                if (isFreePreview || mockSubscriber) {
                    setHasAccess(true)

                    // 영상 토큰 발급
                    const result = await getVideoToken(lessonId)
                    if (result.success && result.token) {
                        setVideoToken(result.token)
                    } else {
                        // 개발 모드: Mock 토큰 사용
                        setVideoToken(MOCK_LESSON.videoToken)
                        console.warn('Using mock video token in development')
                    }
                } else {
                    // 비구독자: 접근 불가
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

    // 진도율 업데이트
    const handleTimeUpdate = (current: number, total: number) => {
        setCurrentTime(current)
        setDuration(total)
        if (total > 0) {
            setProgress(Math.round((current / total) * 100))
        }
    }

    // 영상 시청 완료
    const handleVideoEnded = () => {
        console.log('Lesson completed:', lessonId)
    }

    // 다음/이전 레슨으로 이동
    const findAdjacentLesson = (direction: 'prev' | 'next') => {
        const allLessons = MOCK_CURRICULUM.flatMap(m => m.lessons)
        const currentIndex = allLessons.findIndex(l => l.id === lessonId)

        if (direction === 'prev' && currentIndex > 0) {
            return allLessons[currentIndex - 1]
        }
        if (direction === 'next' && currentIndex < allLessons.length - 1) {
            return allLessons[currentIndex + 1]
        }
        return null
    }

    const prevLesson = findAdjacentLesson('prev')
    const nextLesson = findAdjacentLesson('next')

    const navigateToLesson = (lesson: Lesson) => {
        router.push(`/courses/${courseSlug}/lesson/${lesson.id}`)
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <Button onClick={() => router.back()}>돌아가기</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900">
            {/* 구독 안내 팝업 */}
            {showSubscriptionPrompt && (
                <SubscriptionPrompt onClose={() => setShowSubscriptionPrompt(false)} />
            )}

            <div className="flex flex-col lg:flex-row">
                {/* 메인 영상 영역 */}
                <div className="flex-1 p-4 lg:p-6">
                    {/* 비디오 플레이어 */}
                    {isLoading ? (
                        <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
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

                    {/* 영상 정보 및 컨트롤 */}
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-white">{MOCK_LESSON.title}</h1>
                            {isFreePreview && (
                                <Badge className="bg-green-500/20 text-green-400">무료 공개</Badge>
                            )}
                        </div>
                        <p className="text-slate-400">{MOCK_LESSON.description}</p>

                        {/* 진도 바 */}
                        {hasAccess && (
                            <div className="flex items-center gap-4">
                                <Progress value={progress} className="flex-1" />
                                <span className="text-sm text-slate-400">{progress}%</span>
                            </div>
                        )}

                        {/* 이전/다음 버튼 */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                            <Button
                                variant="outline"
                                disabled={!prevLesson}
                                onClick={() => prevLesson && navigateToLesson(prevLesson)}
                            >
                                ← 이전 강의
                            </Button>
                            <Button
                                disabled={!nextLesson}
                                onClick={() => nextLesson && navigateToLesson(nextLesson)}
                            >
                                다음 강의 →
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 사이드바: 커리큘럼 */}
                <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-700 bg-slate-800/50">
                    <div className="p-4 border-b border-slate-700">
                        <h2 className="font-semibold text-white">커리큘럼</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <Progress value={overallProgress} className="flex-1 h-2" />
                            <span className="text-sm text-slate-400">{overallProgress}%</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {completedLessons}/{totalLessons} 완료
                        </p>
                    </div>

                    <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                        {MOCK_CURRICULUM.map((module) => (
                            <div key={module.id} className="border-b border-slate-700">
                                <div className="px-4 py-3 bg-slate-800">
                                    <h3 className="text-sm font-medium text-slate-300">{module.title}</h3>
                                </div>
                                <div className="divide-y divide-slate-700/50">
                                    {module.lessons.map((lesson) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => navigateToLesson(lesson)}
                                            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-700/50 transition ${lesson.id === lessonId ? 'bg-blue-500/10 border-l-2 border-blue-500' : ''
                                                }`}
                                        >
                                            {/* 완료 체크 또는 재생 아이콘 */}
                                            <span className={`text-lg ${lesson.isCompleted ? 'text-green-400' : 'text-slate-500'}`}>
                                                {lesson.isCompleted ? '✓' : lesson.id === lessonId ? '▶' : '○'}
                                            </span>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className={`text-sm truncate ${lesson.id === lessonId ? 'text-white font-medium' : 'text-slate-300'
                                                        }`}>
                                                        {lesson.title}
                                                    </p>
                                                    {lesson.isFreePreview && (
                                                        <Badge className="text-xs bg-green-500/20 text-green-400 px-1">무료</Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500">{lesson.duration}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
