'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'blockchain', label: '블록체인' },
  { id: 'defi', label: 'DeFi' },
  { id: 'nft', label: 'NFT' },
  { id: 'trading', label: '트레이딩' },
  { id: 'beginner', label: '입문자용' },
]

const COURSES = [
  {
    id: 'web3-fundamentals',
    slug: 'web3-fundamentals',
    thumbnail: '🌐',
    thumbnailBg: 'from-blue-600 to-cyan-500',
    title: '웹3 핵심 개념 완벽 정리',
    subtitle: '블록체인부터 DeFi까지',
    lessons: 24,
    duration: '4시간 30분',
    level: '입문',
    isFree: false,
  },
  {
    id: 'blockchain-basics',
    slug: 'blockchain-basics',
    thumbnail: '📚',
    thumbnailBg: 'from-green-500 to-teal-500',
    title: '블록체인 기초 입문',
    subtitle: '누구나 쉽게 배우는 블록체인',
    lessons: 10,
    duration: '2시간',
    level: '입문',
    isFree: true,
  },
  {
    id: 'defi-masterclass',
    slug: 'defi-masterclass',
    thumbnail: '💰',
    thumbnailBg: 'from-purple-600 to-pink-500',
    title: 'DeFi 마스터클래스',
    subtitle: 'DEX, Lending, Yield Farming',
    lessons: 36,
    duration: '6시간 15분',
    level: '중급',
    isFree: false,
  },
  {
    id: 'nft-development',
    slug: 'nft-development',
    thumbnail: '🎨',
    thumbnailBg: 'from-orange-500 to-red-500',
    title: 'NFT 개발 실전 가이드',
    subtitle: 'ERC-721/1155 스마트 컨트랙트',
    lessons: 18,
    duration: '3시간 45분',
    level: '고급',
    isFree: false,
  },
  {
    id: 'crypto-trading',
    slug: 'crypto-trading',
    thumbnail: '📈',
    thumbnailBg: 'from-emerald-500 to-green-500',
    title: '암호화폐 트레이딩 전략',
    subtitle: '차트 분석과 리스크 관리',
    lessons: 30,
    duration: '5시간 30분',
    level: '중급',
    isFree: false,
  },
  {
    id: 'ethereum-deep-dive',
    slug: 'ethereum-deep-dive',
    thumbnail: '💎',
    thumbnailBg: 'from-indigo-500 to-purple-500',
    title: '이더리움 심층 분석',
    subtitle: 'EVM, Gas, Layer 2 완벽 이해',
    lessons: 28,
    duration: '5시간',
    level: '고급',
    isFree: false,
  },
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredCourses = activeCategory === 'all'
    ? COURSES
    : COURSES // TODO: 실제 카테고리 필터링

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0f0f0f]/95 backdrop-blur border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold">
              TP
            </div>
            <div>
              <span className="text-xl font-bold">TokenPost</span>
              <span className="text-xl font-light text-gray-400 ml-1">Academy</span>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="강의 검색..."
                className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/my-courses">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                내 학습
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                로그인
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16">
        <div className="bg-gradient-to-b from-blue-900/30 to-[#0f0f0f] py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              TokenPost Academy
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              토큰포스트 멤버십 전용 블록체인 교육 플랫폼
            </p>
            <p className="text-gray-500 mb-8">
              멤버십 회원은 모든 프리미엄 강의를 무제한으로 시청할 수 있습니다
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-16 bg-[#0f0f0f] z-30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${activeCategory === category.id
                    ? 'bg-white text-black'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Free Courses */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">무료 강의</h2>
            <Badge className="bg-green-500/20 text-green-400">FREE</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.filter(c => c.isFree).map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`} className="group">
                <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-green-500/50 transition">
                  <div className={`relative aspect-video bg-gradient-to-br ${course.thumbnailBg} flex items-center justify-center`}>
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {course.thumbnail}
                    </span>
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white">무료</Badge>
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-xs">
                      {course.lessons}강 · {course.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg group-hover:text-green-400 transition">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{course.subtitle}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Courses */}
      <section className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">멤버십 전용 강의</h2>
            <Badge className="bg-blue-500/20 text-blue-400">MEMBERS</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.filter(c => !c.isFree).map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`} className="group">
                <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition">
                  <div className={`relative aspect-video bg-gradient-to-br ${course.thumbnailBg} flex items-center justify-center`}>
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {course.thumbnail}
                    </span>
                    <Badge className="absolute top-3 left-3 bg-blue-500/90 text-white">멤버십</Badge>
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-xs">
                      {course.lessons}강 · {course.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg group-hover:text-blue-400 transition">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{course.subtitle}</p>
                    <Badge variant="outline" className="mt-2 text-xs border-white/20 text-gray-400">
                      {course.level}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Info */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">멤버십 회원이 아니신가요?</h2>
          <p className="text-gray-400 mb-6">
            토큰포스트 멤버십에 가입하시면 Academy의 모든 프리미엄 강의를<br />
            무제한으로 시청하실 수 있습니다
          </p>
          <a href="https://www.tokenpost.kr/membership" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
              멤버십 알아보기 →
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
              TP
            </div>
            <span className="text-sm text-gray-500">© 2024 TokenPost Academy</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="https://www.tokenpost.kr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              토큰포스트
            </a>
            <a href="https://www.tokenpost.kr/membership" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              멤버십
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
