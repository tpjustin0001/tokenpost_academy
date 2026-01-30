/**
 * 강의 목록 페이지
 * 수강 가능한 모든 강의를 보여줍니다.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// TODO: Supabase에서 데이터 조회로 대체
const MOCK_COURSES = [
    {
        id: 'web3-fundamentals',
        title: '웹3 핵심 개념 완벽 정리',
        description: '블록체인, 스마트 컨트랙트, DeFi의 기초 개념을 학습합니다.',
        thumbnail: '/images/courses/web3-fundamentals.jpg',
        instructor: '김토큰',
        duration: '8시간 30분',
        level: 'beginner',
        price: 99000,
        lessonCount: 24,
        enrolledCount: 1234,
        tags: ['Web3', '블록체인', '입문'],
    },
    {
        id: 'defi-masterclass',
        title: 'DeFi 마스터클래스',
        description: 'Uniswap, Aave, Compound 등 주요 DeFi 프로토콜을 심층 분석합니다.',
        thumbnail: '/images/courses/defi-masterclass.jpg',
        instructor: '이디파이',
        duration: '12시간',
        level: 'intermediate',
        price: 149000,
        lessonCount: 36,
        enrolledCount: 856,
        tags: ['DeFi', '스마트컨트랙트', '중급'],
    },
    {
        id: 'nft-development',
        title: 'NFT 개발 실전 가이드',
        description: 'ERC-721, ERC-1155 표준을 활용한 NFT 컬렉션 개발',
        thumbnail: '/images/courses/nft-development.jpg',
        instructor: '박엔프티',
        duration: '10시간',
        level: 'intermediate',
        price: 129000,
        lessonCount: 28,
        enrolledCount: 672,
        tags: ['NFT', 'Solidity', '개발'],
    },
]

function getLevelBadge(level: string) {
    switch (level) {
        case 'beginner':
            return <Badge variant="secondary" className="bg-green-500/20 text-green-400">입문</Badge>
        case 'intermediate':
            return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">중급</Badge>
        case 'advanced':
            return <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">고급</Badge>
        default:
            return null
    }
}

export default function CoursesPage() {
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_COURSES.map((course) => (
                        <Link key={course.id} href={`/courses/${course.id}`}>
                            <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all hover:scale-[1.02] cursor-pointer h-full">
                                {/* 썸네일 */}
                                <div className="aspect-video bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-t-lg flex items-center justify-center">
                                    <span className="text-4xl">🎓</span>
                                </div>

                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getLevelBadge(course.level)}
                                        {course.tags.slice(0, 2).map((tag) => (
                                            <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <CardTitle className="text-lg text-white line-clamp-2">
                                        {course.title}
                                    </CardTitle>
                                    <CardDescription className="text-slate-400 line-clamp-2">
                                        {course.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-slate-500">
                                        <span>{course.instructor}</span>
                                        <span>{course.lessonCount}개 강의</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xl font-bold text-white">
                                            {course.price.toLocaleString()}원
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {course.enrolledCount.toLocaleString()}명 수강중
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
