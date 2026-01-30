'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// 추천 강의
const FEATURED_COURSES = [
  {
    id: 'web3-fundamentals',
    title: '웹3 핵심 개념 완벽 정리',
    description: '블록체인, 스마트 컨트랙트, DeFi의 기초부터 심화까지',
    instructor: '김토큰',
    lessons: 24,
    level: '입문',
    thumbnail: '🌐',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'defi-masterclass',
    title: 'DeFi 마스터클래스',
    description: 'DEX, Lending, Yield Farming 전략 완벽 가이드',
    instructor: '이디파이',
    lessons: 36,
    level: '중급',
    thumbnail: '💰',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'nft-development',
    title: 'NFT 개발 실전 가이드',
    description: 'ERC-721/1155 스마트 컨트랙트 개발 및 마켓플레이스 구축',
    instructor: '박엔프티',
    lessons: 18,
    level: '고급',
    thumbnail: '🎨',
    color: 'from-orange-500 to-red-500',
  },
]

const STATS = [
  { number: '50+', label: '전문 강의' },
  { number: '10,000+', label: '수강생' },
  { number: '200+', label: '시간 콘텐츠' },
  { number: '98%', label: '만족도' },
]

const FEATURES = [
  {
    icon: '🔐',
    title: '보안 스트리밍',
    description: 'Cloudflare Stream 기반 DRM 보호로 콘텐츠를 안전하게 제공합니다.',
  },
  {
    icon: '📊',
    title: '학습 분석',
    description: '실시간 진도 추적과 학습 패턴 분석으로 효율적인 학습을 지원합니다.',
  },
  {
    icon: '🎯',
    title: '맞춤형 커리큘럼',
    description: '레벨별 맞춤 강의로 입문자부터 전문가까지 모두를 위한 콘텐츠.',
  },
  {
    icon: '💬',
    title: '커뮤니티',
    description: '전문가와 수강생이 함께하는 활발한 Q&A 커뮤니티를 제공합니다.',
  },
]

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-[#0a0a0f]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/5 to-transparent rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all">
                TP
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">TokenPost</span>
                <span className="text-xs text-slate-400 -mt-1">Academy</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/courses" className="text-slate-300 hover:text-white transition font-medium">
                강의
              </Link>
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition font-medium">
                대시보드
              </Link>
              <Link href="/login">
                <Button className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10">
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className={`max-w-4xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-slate-300">토큰포스트 구독자 전용 프리미엄 콘텐츠</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
              <span className="bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
                Web3 시대를 위한
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                프리미엄 학습 플랫폼
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
              블록체인, DeFi, NFT 분야 최고 전문가들이 직접 제작한 강의로
              <span className="text-white font-medium"> Web3 개발자</span>로 성장하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/courses">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                  지금 시작하기
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-white/20 hover:bg-white/10">
                  강의 둘러보기
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/40 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">인기 강의</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                전문가가 만든 프리미엄 콘텐츠
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              현업 전문가들이 직접 제작한 실전 노하우를 담은 강의
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_COURSES.map((course, i) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className={`group h-full bg-white/[0.03] border-white/10 hover:border-white/20 backdrop-blur transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-${course.color.split('-')[1]}-500/10`}>
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      {course.thumbnail}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs text-slate-400 border-slate-700 bg-white/5">
                        {course.level}
                      </Badge>
                      <span className="text-xs text-slate-500">{course.lessons}개 레슨</span>
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-blue-300 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400 line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm">
                        👤
                      </div>
                      <span className="text-sm text-slate-400">{course.instructor}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                전체 강의 보기
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">플랫폼 특징</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                왜 TokenPost Academy인가?
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 backdrop-blur">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              지금 바로 Web3 전문가로의 여정을 시작하세요
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
              토큰포스트 구독자라면 모든 프리미엄 강의를 무제한으로 수강할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-slate-100">
                  무료로 시작하기
                </Button>
              </Link>
              <a href="https://www.tokenpost.kr/subscribe" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 hover:bg-white/10">
                  구독 알아보기
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                TP
              </div>
              <span className="text-slate-400">© 2026 TokenPost Academy</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="https://www.tokenpost.kr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                TokenPost
              </a>
              <a href="#" className="hover:text-white transition">이용약관</a>
              <a href="#" className="hover:text-white transition">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
