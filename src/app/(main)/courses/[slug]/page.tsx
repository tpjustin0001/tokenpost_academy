'use client'

/**
 * 강의 상세 페이지 - 프리미엄 디자인
 */

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Lesson {
    id: string
    title: string
    duration: string
    isFreePreview?: boolean
}

interface Module {
    id: string
    title: string
    lessons: Lesson[]
}

const COURSE_DATA = {
    'blockchain-basics': {
        title: '블록체인 기초 입문',
        description: '블록체인 기술의 핵심 개념을 처음부터 차근차근 배워보세요. 암호화, 분산 원장, 합의 알고리즘 등 블록체인의 기본 원리를 이해하고 실제 활용 사례까지 알아봅니다.',
        level: '입문',
        duration: '2시간',
        lessons: 10,
        isFree: true,
        gradient: 'from-emerald-500 to-teal-600',
    },
    'web3-fundamentals': {
        title: '웹3 핵심 개념',
        description: '웹3의 핵심 개념과 기술 스택을 체계적으로 학습합니다. 지갑, 스마트 컨트랙트, 탈중앙화 애플리케이션(dApp)의 작동 원리를 이해하고 직접 사용해봅니다.',
        level: '입문',
        duration: '4시간 30분',
        lessons: 24,
        isFree: false,
        gradient: 'from-blue-500 to-indigo-600',
    },
    'defi-masterclass': {
        title: 'DeFi 마스터클래스',
        description: '탈중앙화 금융(DeFi)의 모든 것을 배웁니다. DEX, Lending, Yield Farming, Liquidity Mining 등 DeFi 프로토콜의 작동 원리와 투자 전략을 학습합니다.',
        level: '중급',
        duration: '6시간 15분',
        lessons: 36,
        isFree: false,
        gradient: 'from-purple-500 to-pink-600',
    },
}

const CURRICULUM: Module[] = [
    {
        id: 'module-1',
        title: '블록체인 기초 이론',
        lessons: [
            { id: 'lesson-1', title: '블록체인이란 무엇인가?', duration: '15:30', isFreePreview: true },
            { id: 'lesson-2', title: '탈중앙화의 의미와 중요성', duration: '12:45' },
            { id: 'lesson-3', title: '합의 알고리즘 이해하기', duration: '18:20' },
            { id: 'lesson-4', title: '암호화와 해시 함수', duration: '16:00' },
        ],
    },
    {
        id: 'module-2',
        title: '스마트 컨트랙트 기초',
        lessons: [
            { id: 'lesson-5', title: '스마트 컨트랙트 개념', duration: '14:00' },
            { id: 'lesson-6', title: 'Solidity 기초 문법', duration: '22:15' },
            { id: 'lesson-7', title: '첫 번째 컨트랙트 작성하기', duration: '25:30' },
        ],
    },
    {
        id: 'module-3',
        title: '실전 활용',
        lessons: [
            { id: 'lesson-8', title: '지갑 연동하기', duration: '18:00' },
            { id: 'lesson-9', title: 'dApp과 상호작용', duration: '20:00' },
            { id: 'lesson-10', title: '프로젝트 마무리', duration: '15:00' },
        ],
    },
]

export default function CourseDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string

    const course = COURSE_DATA[slug as keyof typeof COURSE_DATA] || COURSE_DATA['blockchain-basics']
    const allLessons = CURRICULUM.flatMap(m => m.lessons)
    const firstLesson = allLessons[0]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Background */}
            <div className="fixed inset-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 backdrop-blur-xl bg-slate-950/80 border-b border-white/5 z-50">
                <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/')}
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
                    </div>
                    <Link href="/login">
                        <Button variant="outline" size="sm" className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5">
                            로그인
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="relative pt-24 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* Course Info */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${course.isFree ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {course.isFree ? '무료' : '멤버십'}
                                </span>
                                <span className="text-xs text-slate-500">{course.level}</span>
                            </div>
                            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                            <p className="text-lg text-slate-400 leading-relaxed mb-6">
                                {course.description}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>{course.lessons}개 레슨</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="relative">
                            <div className="sticky top-24 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur">
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${course.gradient} opacity-5`} />
                                <div className="relative">
                                    {course.isFree ? (
                                        <>
                                            <p className="text-2xl font-bold mb-2">무료</p>
                                            <p className="text-sm text-slate-400 mb-6">누구나 시청 가능</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-2xl font-bold mb-2">멤버십 전용</p>
                                            <p className="text-sm text-slate-400 mb-6">토큰포스트 멤버십 회원 무제한</p>
                                        </>
                                    )}
                                    <Link href={`/courses/${slug}/lesson/${firstLesson.id}`}>
                                        <Button className={`w-full mb-3 ${course.isFree ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'} shadow-lg`}>
                                            강의 시작하기
                                        </Button>
                                    </Link>
                                    {!course.isFree && (
                                        <a href="https://www.tokenpost.kr/membership" target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" className="w-full border-white/10 text-slate-400 hover:text-white hover:bg-white/5">
                                                멤버십 알아보기
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Curriculum */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                            <h2 className="text-xl font-semibold">커리큘럼</h2>
                            <span className="text-sm text-slate-500">{allLessons.length}개 레슨</span>
                        </div>

                        <div className="space-y-4">
                            {CURRICULUM.map((module, moduleIndex) => (
                                <div key={module.id} className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-medium text-slate-400">
                                                {moduleIndex + 1}
                                            </span>
                                            <h3 className="font-semibold">{module.title}</h3>
                                        </div>
                                        <span className="text-sm text-slate-500">{module.lessons.length}개 레슨</span>
                                    </div>
                                    <div>
                                        {module.lessons.map((lesson, lessonIndex) => (
                                            <Link
                                                key={lesson.id}
                                                href={`/courses/${slug}/lesson/${lesson.id}`}
                                                className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition border-b border-white/5 last:border-0"
                                            >
                                                <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-slate-500">
                                                    {lessonIndex + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-300">{lesson.title}</span>
                                                        {lesson.isFreePreview && (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400">
                                                                무료
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-sm text-slate-500">{lesson.duration}</span>
                                                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
