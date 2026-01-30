import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// 추천 강의 (TODO: Supabase에서 조회)
const FEATURED_COURSES = [
  {
    id: 'web3-fundamentals',
    title: '웹3 핵심 개념 완벽 정리',
    description: '블록체인, 스마트 컨트랙트, DeFi의 기초부터 심화까지',
    instructor: '김토큰',
    lessons: 24,
    level: '입문',
    thumbnail: '🌐',
  },
  {
    id: 'defi-masterclass',
    title: 'DeFi 마스터클래스',
    description: 'DEX, Lending, Yield Farming 전략 완벽 가이드',
    instructor: '이디파이',
    lessons: 36,
    level: '중급',
    thumbnail: '💰',
  },
  {
    id: 'nft-development',
    title: 'NFT 개발 실전 가이드',
    description: 'ERC-721/1155 스마트 컨트랙트 개발 및 마켓플레이스 구축',
    instructor: '박엔프티',
    lessons: 18,
    level: '고급',
    thumbnail: '🎨',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                TP
              </div>
              <span className="text-xl font-bold text-white">Academy</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/courses" className="text-slate-300 hover:text-white transition">
                강의 목록
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  로그인
                </Button>
              </Link>
            </div>
          </nav>

          {/* Hero content */}
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30">
              토큰포스트 구독자 전용
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Web3 시대를 위한
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                프리미엄 교육 플랫폼
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
              블록체인, DeFi, NFT 전문가들이 직접 제작한 강의로
              Web3 개발자로 성장하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8">
                  강의 둘러보기 →
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8">
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">인기 강의</h2>
          <p className="text-slate-400">전문가들이 직접 제작한 프리미엄 콘텐츠</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_COURSES.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all hover:scale-[1.02] h-full">
                <CardHeader>
                  <div className="text-5xl mb-4">{course.thumbnail}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                      {course.level}
                    </Badge>
                    <span className="text-xs text-slate-500">{course.lessons}개 레슨</span>
                  </div>
                  <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">강사: {course.instructor}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/courses">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              전체 강의 보기 →
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-800/30 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-2">보안 영상 스트리밍</h3>
              <p className="text-slate-400">Cloudflare Stream으로 콘텐츠 보호</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-white mb-2">학습 진도 추적</h3>
              <p className="text-slate-400">시청 기록 자동 저장 및 이어보기</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-white mb-2">전문가 강의</h3>
              <p className="text-slate-400">현업 전문가의 실전 노하우</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© 2024 TokenPost Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
