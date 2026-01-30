'use client'

/**
 * 강의실 (Classroom) 페이지 - YouTube 스타일
 */

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { VideoPlayer } from '@/components/player/VideoPlayer'
import { Button } from '@/components/ui/button'
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
    thumbnail?: string
    views?: string
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
            { id: 'lesson-1', title: '블록체인이란 무엇인가?', duration: '15:30', isCompleted: true, isFreePreview: true, views: '12.5만' },
            { id: 'lesson-2', title: '탈중앙화의 의미', duration: '12:45', isCompleted: true, views: '8.3만' },
            { id: 'lesson-3', title: '합의 알고리즘 이해하기', duration: '18:20', isCompleted: false, views: '6.1만' },
        ],
    },
    {
        id: 'module-2',
        title: '스마트 컨트랙트',
        lessons: [
            { id: 'lesson-4', title: '스마트 컨트랙트 개념', duration: '14:00', isCompleted: false, views: '5.2만' },
            { id: 'lesson-5', title: 'Solidity 기초 문법', duration: '22:15', isCompleted: false, views: '4.8만' },
            { id: 'lesson-6', title: '첫 번째 컨트랙트 작성하기', duration: '25:30', isCompleted: false, views: '4.1만' },
        ],
    },
]

const MOCK_LESSON = {
    id: 'lesson-3',
    title: '합의 알고리즘 이해하기',
    description: 'PoW, PoS, DPoS 등 주요 합의 알고리즘의 작동 원리를 알아봅니다.',
    videoToken: 'mock-video-token',
    views: '61,234',
    uploadedAt: '2024년 1월 15일',
    likes: '2.3천',
}

const INSTRUCTOR = {
    name: '김토큰',
    avatar: '👨‍💻',
    subscribers: '25.4만',
    verified: true,
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
    const [isDescExpanded, setIsDescExpanded] = useState(false)
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)

    const courseSlug = params.slug as string
    const lessonId = params.lessonId as string

    const currentLesson = MOCK_CURRICULUM.flatMap(m => m.lessons).find(l => l.id === lessonId)
    const isFreePreview = currentLesson?.isFreePreview || false

    useEffect(() => {
        async function checkAccessAndGetToken() {
            try {
                setIsLoading(true)
                setError(null)

                const mockSession = document.cookie.includes('mock-session')
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
            {/* 구독 안내 팝업 */}
            {showSubscriptionPrompt && (
                <SubscriptionPrompt onClose={() => setShowSubscriptionPrompt(false)} />
            )}

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f] border-b border-white/10 z-50 flex items-center px-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <Link href="/" className="flex items-center gap-1">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                            TP
                        </div>
                        <span className="text-xl font-semibold">Academy</span>
                    </Link>
                </div>
                <div className="flex-1 max-w-xl mx-auto px-4">
                    <input
                        type="text"
                        placeholder="검색"
                        className="w-full h-10 px-4 bg-[#121212] border border-white/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <Link href="/login">
                    <Button variant="outline" className="rounded-full border-blue-500 text-blue-500 hover:bg-blue-500/10">
                        로그인
                    </Button>
                </Link>
            </header>

            {/* Main Content */}
            <div className="pt-14 flex flex-col xl:flex-row">
                {/* Video Section */}
                <div className="flex-1 xl:max-w-[calc(100%-400px)]">
                    {/* Video Player */}
                    <div className="w-full bg-black">
                        {isLoading ? (
                            <div className="aspect-video flex items-center justify-center">
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

                    {/* Video Info */}
                    <div className="p-4">
                        {/* Title */}
                        <h1 className="text-xl font-bold mb-2">
                            {currentLesson?.title || MOCK_LESSON.title}
                            {isFreePreview && (
                                <Badge className="ml-2 bg-green-500/20 text-green-400">무료 공개</Badge>
                            )}
                        </h1>

                        {/* Views & Date */}
                        <div className="text-sm text-gray-400 mb-4">
                            조회수 {MOCK_LESSON.views}회 · {MOCK_LESSON.uploadedAt}
                        </div>

                        {/* Channel Info + Actions */}
                        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
                            {/* Channel */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                                    {INSTRUCTOR.avatar}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">{INSTRUCTOR.name}</span>
                                        {INSTRUCTOR.verified && (
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500">구독자 {INSTRUCTOR.subscribers}명</span>
                                </div>
                                <Button className="ml-4 bg-white text-black hover:bg-gray-200 rounded-full px-6">
                                    구독
                                </Button>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setLiked(!liked)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${liked ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 hover:bg-white/20'}`}
                                >
                                    <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    {MOCK_LESSON.likes}
                                </button>
                                <button
                                    onClick={() => setSaved(!saved)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${saved ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 hover:bg-white/20'}`}
                                >
                                    <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    저장
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    공유
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-4 p-4 bg-white/5 rounded-xl">
                            <div className={`text-sm text-gray-300 ${isDescExpanded ? '' : 'line-clamp-2'}`}>
                                <p className="font-medium mb-2">조회수 {MOCK_LESSON.views}회 · {MOCK_LESSON.uploadedAt}</p>
                                <p>{MOCK_LESSON.description}</p>
                                {isDescExpanded && (
                                    <div className="mt-4 space-y-2">
                                        <p>📌 이 강의에서 배우는 내용:</p>
                                        <p>• PoW (Proof of Work) 작동 원리</p>
                                        <p>• PoS (Proof of Stake) 장단점</p>
                                        <p>• DPoS와 다른 합의 메커니즘</p>
                                        <p>• 각 알고리즘의 실제 사용 사례</p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsDescExpanded(!isDescExpanded)}
                                className="mt-2 text-sm font-medium text-gray-400 hover:text-white"
                            >
                                {isDescExpanded ? '간략히' : '더보기'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Playlist Sidebar */}
                <div className="xl:w-[400px] border-t xl:border-t-0 xl:border-l border-white/10 bg-[#0f0f0f]">
                    <div className="sticky top-14">
                        <div className="p-4 border-b border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="font-semibold">강의 목록</h2>
                                <span className="text-sm text-gray-500">
                                    {MOCK_CURRICULUM.flatMap(m => m.lessons).findIndex(l => l.id === lessonId) + 1}/
                                    {MOCK_CURRICULUM.flatMap(m => m.lessons).length}
                                </span>
                            </div>
                            {/* Progress bar */}
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all"
                                    style={{ width: `${(MOCK_CURRICULUM.flatMap(m => m.lessons).filter(l => l.isCompleted).length / MOCK_CURRICULUM.flatMap(m => m.lessons).length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
                            {MOCK_CURRICULUM.map((module) => (
                                <div key={module.id}>
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-white/5">
                                        {module.title}
                                    </div>
                                    {module.lessons.map((lesson, index) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => navigateToLesson(lesson)}
                                            className={`w-full flex gap-3 p-2 hover:bg-white/5 transition ${lesson.id === lessonId ? 'bg-white/10' : ''}`}
                                        >
                                            {/* Index or Playing */}
                                            <div className="w-6 flex-shrink-0 text-center">
                                                {lesson.id === lessonId ? (
                                                    <span className="text-blue-500">▶</span>
                                                ) : lesson.isCompleted ? (
                                                    <span className="text-green-500">✓</span>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">{MOCK_CURRICULUM.flatMap(m => m.lessons).findIndex(l => l.id === lesson.id) + 1}</span>
                                                )}
                                            </div>

                                            {/* Thumbnail */}
                                            <div className="relative w-28 aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                                                <span className="text-2xl">📚</span>
                                                <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 rounded text-[10px]">
                                                    {lesson.duration}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 text-left min-w-0">
                                                <p className={`text-sm line-clamp-2 ${lesson.id === lessonId ? 'text-white font-medium' : 'text-gray-300'}`}>
                                                    {lesson.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500">{INSTRUCTOR.name}</span>
                                                    {lesson.isFreePreview && (
                                                        <Badge className="text-[10px] bg-green-500/20 text-green-400 px-1 py-0">무료</Badge>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-600">조회수 {lesson.views}회</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
