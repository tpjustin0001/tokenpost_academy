/**
 * 강의 상세 페이지
 * 강의 정보, 커리큘럼, 수강 신청 버튼
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

// TODO: Supabase에서 데이터 조회로 대체
const MOCK_COURSE = {
    id: 'web3-fundamentals',
    title: '웹3 핵심 개념 완벽 정리',
    description: '블록체인, 스마트 컨트랙트, DeFi의 기초 개념부터 실전 활용까지. 웹3 세계로의 첫 걸음을 내딛으세요.',
    thumbnail: '/images/courses/web3-fundamentals.jpg',
    instructor: {
        name: '김토큰',
        title: 'Web3 개발자 & 교육자',
        bio: '10년차 블록체인 개발자. 유수 기업에서 DeFi 프로젝트를 이끌어온 경험을 바탕으로, 초보자도 이해하기 쉬운 강의를 제공합니다.',
    },
    duration: '8시간 30분',
    level: 'beginner',
    price: 99000,
    enrolledCount: 1234,
    rating: 4.8,
    reviewCount: 256,
    lastUpdated: '2024-01-15',
    modules: [
        {
            id: 'module-1',
            title: '블록체인 기초',
            lessons: [
                { id: 'lesson-1', title: '블록체인이란 무엇인가?', duration: '15:30', isFree: true },
                { id: 'lesson-2', title: '탈중앙화의 의미', duration: '12:45', isFree: false },
                { id: 'lesson-3', title: '합의 알고리즘 이해하기', duration: '18:20', isFree: false },
            ],
        },
        {
            id: 'module-2',
            title: '스마트 컨트랙트',
            lessons: [
                { id: 'lesson-4', title: '스마트 컨트랙트 개념', duration: '14:00', isFree: false },
                { id: 'lesson-5', title: 'Solidity 기초 문법', duration: '22:15', isFree: false },
                { id: 'lesson-6', title: '첫 번째 컨트랙트 작성하기', duration: '25:30', isFree: false },
            ],
        },
        {
            id: 'module-3',
            title: 'DeFi 입문',
            lessons: [
                { id: 'lesson-7', title: 'DeFi 생태계 개요', duration: '16:45', isFree: false },
                { id: 'lesson-8', title: 'DEX와 AMM 이해하기', duration: '20:10', isFree: false },
                { id: 'lesson-9', title: 'Lending/Borrowing 프로토콜', duration: '19:30', isFree: false },
            ],
        },
    ],
    whatYouLearn: [
        '블록체인의 핵심 원리와 작동 방식',
        '스마트 컨트랙트 개발 기초',
        'DeFi 프로토콜의 구조와 활용법',
        'Web3 지갑 연동 및 트랜잭션 처리',
        '실제 프로젝트 적용 사례 분석',
    ],
}

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const course = MOCK_COURSE // TODO: slug로 강의 조회

    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* 헤더 섹션 */}
            <div className="bg-slate-800/50 border-b border-slate-700">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 강의 정보 */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-green-500/20 text-green-400">입문</Badge>
                                <Badge variant="outline" className="border-slate-600 text-slate-400">Web3</Badge>
                                <Badge variant="outline" className="border-slate-600 text-slate-400">블록체인</Badge>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                {course.title}
                            </h1>

                            <p className="text-lg text-slate-400">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                    ⭐ {course.rating} ({course.reviewCount}개 리뷰)
                                </span>
                                <span>{course.enrolledCount.toLocaleString()}명 수강중</span>
                                <span>{totalLessons}개 강의</span>
                                <span>{course.duration}</span>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {course.instructor.name[0]}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{course.instructor.name}</p>
                                    <p className="text-sm text-slate-400">{course.instructor.title}</p>
                                </div>
                            </div>
                        </div>

                        {/* 구매 카드 */}
                        <Card className="bg-slate-800 border-slate-700 lg:sticky lg:top-6">
                            <CardContent className="p-6 space-y-4">
                                {/* 썸네일 */}
                                <div className="aspect-video bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-lg flex items-center justify-center">
                                    <span className="text-6xl">🎓</span>
                                </div>

                                <div className="text-3xl font-bold text-white">
                                    {course.price.toLocaleString()}원
                                </div>

                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="lg">
                                    수강 신청하기
                                </Button>

                                <p className="text-center text-sm text-slate-500">
                                    30일 환불 보장
                                </p>

                                <Separator className="bg-slate-700" />

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-400">
                                        <span>강의 수</span>
                                        <span className="text-white">{totalLessons}개</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>총 시간</span>
                                        <span className="text-white">{course.duration}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>수강 기한</span>
                                        <span className="text-white">무제한</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>수료증</span>
                                        <span className="text-white">발급 가능</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* 콘텐츠 섹션 */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <Tabs defaultValue="curriculum" className="space-y-8">
                    <TabsList className="bg-slate-800/50 border border-slate-700">
                        <TabsTrigger value="curriculum">커리큘럼</TabsTrigger>
                        <TabsTrigger value="overview">강의 소개</TabsTrigger>
                        <TabsTrigger value="instructor">강사 소개</TabsTrigger>
                    </TabsList>

                    {/* 커리큘럼 */}
                    <TabsContent value="curriculum" className="space-y-4">
                        {course.modules.map((module, idx) => (
                            <Card key={module.id} className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white">
                                        섹션 {idx + 1}. {module.title}
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">
                                        {module.lessons.length}개 강의
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {module.lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-500">▶</span>
                                                <span className="text-slate-300">{lesson.title}</span>
                                                {lesson.isFree && (
                                                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                                                        무료 미리보기
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-sm text-slate-500">{lesson.duration}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>

                    {/* 강의 소개 */}
                    <TabsContent value="overview">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">이 강의에서 배우는 것</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {course.whatYouLearn.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                                            <span className="text-green-400 mt-1">✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 강사 소개 */}
                    <TabsContent value="instructor">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                        {course.instructor.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{course.instructor.name}</h3>
                                        <p className="text-slate-400 mb-4">{course.instructor.title}</p>
                                        <p className="text-slate-300">{course.instructor.bio}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
