'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// 카테고리
const CATEGORIES = [
  { id: 'all', label: '전체', active: true },
  { id: 'blockchain', label: '블록체인' },
  { id: 'defi', label: 'DeFi' },
  { id: 'nft', label: 'NFT' },
  { id: 'trading', label: '트레이딩' },
  { id: 'development', label: '개발' },
  { id: 'beginner', label: '입문자용' },
]

// 강의 목록 (YouTube 스타일)
const COURSES = [
  {
    id: 'web3-fundamentals',
    slug: 'web3-fundamentals',
    thumbnail: '🌐',
    thumbnailBg: 'from-blue-600 to-cyan-500',
    title: '웹3 핵심 개념 완벽 정리 - 블록체인부터 DeFi까지',
    instructor: '김토큰',
    instructorAvatar: '👨‍💻',
    views: '12.5만',
    duration: '24강',
    uploadedAt: '2주 전',
    verified: true,
  },
  {
    id: 'defi-masterclass',
    slug: 'defi-masterclass',
    thumbnail: '💰',
    thumbnailBg: 'from-purple-600 to-pink-500',
    title: 'DeFi 마스터클래스 - DEX, Lending, Yield Farming 완벽 가이드',
    instructor: '이디파이',
    instructorAvatar: '👩‍💼',
    views: '8.3만',
    duration: '36강',
    uploadedAt: '1개월 전',
    verified: true,
  },
  {
    id: 'nft-development',
    slug: 'nft-development',
    thumbnail: '🎨',
    thumbnailBg: 'from-orange-500 to-red-500',
    title: 'NFT 개발 실전 가이드 - ERC-721/1155 스마트 컨트랙트',
    instructor: '박엔프티',
    instructorAvatar: '🧑‍🎨',
    views: '5.7만',
    duration: '18강',
    uploadedAt: '3주 전',
    verified: false,
  },
  {
    id: 'solidity-basics',
    slug: 'solidity-basics',
    thumbnail: '⚡',
    thumbnailBg: 'from-yellow-500 to-orange-500',
    title: 'Solidity 기초부터 실전까지 - 스마트 컨트랙트 개발 입문',
    instructor: '최솔리디',
    instructorAvatar: '👨‍🔬',
    views: '15.2만',
    duration: '42강',
    uploadedAt: '1주 전',
    verified: true,
  },
  {
    id: 'crypto-trading',
    slug: 'crypto-trading',
    thumbnail: '📈',
    thumbnailBg: 'from-green-500 to-emerald-500',
    title: '암호화폐 트레이딩 전략 - 차트 분석과 리스크 관리',
    instructor: '정트레이더',
    instructorAvatar: '📊',
    views: '22.1만',
    duration: '30강',
    uploadedAt: '5일 전',
    verified: true,
  },
  {
    id: 'ethereum-deep-dive',
    slug: 'ethereum-deep-dive',
    thumbnail: '💎',
    thumbnailBg: 'from-indigo-500 to-purple-500',
    title: '이더리움 심층 분석 - EVM, Gas, Layer 2 완벽 이해',
    instructor: '한이더',
    instructorAvatar: '🔷',
    views: '9.8만',
    duration: '28강',
    uploadedAt: '2개월 전',
    verified: true,
  },
]

// 사이드바 메뉴
const SIDEBAR_MENU = [
  { icon: '🏠', label: '홈', href: '/', active: true },
  { icon: '🔥', label: '인기', href: '/courses' },
  { icon: '📚', label: '구독', href: '/dashboard' },
  { divider: true },
  { icon: '📁', label: '보관함', href: '/dashboard' },
  { icon: '⏰', label: '나중에 볼 강의', href: '/dashboard' },
  { icon: '👍', label: '좋아요 표시한 강의', href: '/dashboard' },
  { divider: true },
  { icon: '⚙️', label: '설정', href: '#' },
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f] border-b border-white/10 z-50 flex items-center px-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-full transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-1">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
              TP
            </div>
            <span className="text-xl font-semibold tracking-tight">Academy</span>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-2xl mx-auto px-4">
          <div className="flex">
            <input
              type="text"
              placeholder="강의 검색"
              className="flex-1 h-10 px-4 bg-[#121212] border border-white/20 rounded-l-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button className="h-10 px-6 bg-white/10 border border-l-0 border-white/20 rounded-r-full hover:bg-white/20 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button className="bg-transparent hover:bg-white/10 border border-blue-500 text-blue-500 rounded-full px-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              로그인
            </Button>
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-14 left-0 bottom-0 bg-[#0f0f0f] z-40 transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-[72px]'}`}>
        <nav className="py-3">
          {SIDEBAR_MENU.map((item, i) => (
            item.divider ? (
              <div key={i} className="my-3 border-b border-white/10" />
            ) : (
              <Link
                key={i}
                href={item.href || '#'}
                className={`flex items-center gap-6 px-3 py-2.5 mx-1 rounded-lg transition ${item.active ? 'bg-white/10' : 'hover:bg-white/5'
                  } ${sidebarOpen ? '' : 'flex-col gap-1 py-4'}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`text-sm ${sidebarOpen ? '' : 'text-[10px]'}`}>{item.label}</span>
              </Link>
            )
          ))}
        </nav>

        {/* Subscriber Badge */}
        {sidebarOpen && (
          <div className="absolute bottom-4 left-3 right-3">
            <div className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-white/10">
              <p className="text-xs text-slate-400 mb-2">토큰포스트 구독자 전용</p>
              <a href="https://www.tokenpost.kr/subscribe" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                  구독하기
                </Button>
              </a>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`pt-14 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-[72px]'}`}>
        {/* Category Chips */}
        <div className="sticky top-14 bg-[#0f0f0f] z-30 border-b border-white/10">
          <div className="flex items-center gap-3 px-6 py-3 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${activeCategory === category.id
                    ? 'bg-white text-black'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {COURSES.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`} className="group">
                {/* Thumbnail */}
                <div className={`relative aspect-video rounded-xl bg-gradient-to-br ${course.thumbnailBg} flex items-center justify-center overflow-hidden`}>
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {course.thumbnail}
                  </span>
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-xs font-medium">
                    {course.duration}
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Info */}
                <div className="flex gap-3 mt-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg flex-shrink-0">
                    {course.instructorAvatar}
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm leading-5 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm text-gray-400">{course.instructor}</span>
                      {course.verified && (
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      조회수 {course.views}회 · {course.uploadedAt}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Premium Banner */}
        <div className="mx-6 mb-6">
          <div className="p-6 rounded-xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-white/10 flex items-center justify-between">
            <div>
              <Badge className="bg-yellow-500 text-black mb-2">Premium</Badge>
              <h3 className="text-xl font-bold mb-1">토큰포스트 구독자 혜택</h3>
              <p className="text-gray-400 text-sm">모든 프리미엄 강의 무제한 시청 + 광고 없는 학습</p>
            </div>
            <a href="https://www.tokenpost.kr/subscribe" target="_blank" rel="noopener noreferrer">
              <Button className="bg-white text-black hover:bg-gray-100 px-6">
                자세히 보기
              </Button>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
