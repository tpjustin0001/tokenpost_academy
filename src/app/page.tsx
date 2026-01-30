'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// 사이드바 메뉴
const SIDEBAR_MENU = [
  {
    section: '메인',
    items: [
      { icon: '🏠', label: '홈', href: '/' },
      { icon: '📚', label: '전체 강의', href: '/courses' },
      { icon: '🎯', label: '내 학습', href: '/my-courses' },
    ]
  },
  {
    section: '카테고리',
    items: [
      { icon: '⛓️', label: '블록체인', href: '/category/blockchain' },
      { icon: '💰', label: 'DeFi', href: '/category/defi' },
      { icon: '🎨', label: 'NFT', href: '/category/nft' },
      { icon: '📈', label: '트레이딩', href: '/category/trading' },
      { icon: '💻', label: '개발', href: '/category/development' },
    ]
  },
]

const COURSES = [
  {
    id: 'blockchain-basics',
    slug: 'blockchain-basics',
    title: '블록체인 기초 입문',
    description: '누구나 쉽게 배우는 블록체인의 기본 개념',
    lessons: 10,
    duration: '2시간',
    level: '입문',
    category: '블록체인',
    isFree: true,
    progress: 0,
  },
  {
    id: 'web3-fundamentals',
    slug: 'web3-fundamentals',
    title: '웹3 핵심 개념 완벽 정리',
    description: '블록체인부터 DeFi까지 Web3의 모든 것',
    lessons: 24,
    duration: '4시간 30분',
    level: '입문',
    category: '블록체인',
    isFree: false,
    progress: 45,
  },
  {
    id: 'defi-masterclass',
    slug: 'defi-masterclass',
    title: 'DeFi 마스터클래스',
    description: 'DEX, Lending, Yield Farming 완벽 가이드',
    lessons: 36,
    duration: '6시간 15분',
    level: '중급',
    category: 'DeFi',
    isFree: false,
    progress: 0,
  },
  {
    id: 'nft-development',
    slug: 'nft-development',
    title: 'NFT 개발 실전 가이드',
    description: 'ERC-721/1155 스마트 컨트랙트 개발',
    lessons: 18,
    duration: '3시간 45분',
    level: '고급',
    category: 'NFT',
    isFree: false,
    progress: 0,
  },
  {
    id: 'crypto-trading',
    slug: 'crypto-trading',
    title: '암호화폐 트레이딩 전략',
    description: '차트 분석과 리스크 관리 실전',
    lessons: 30,
    duration: '5시간 30분',
    level: '중급',
    category: '트레이딩',
    isFree: false,
    progress: 20,
  },
  {
    id: 'solidity-basics',
    slug: 'solidity-basics',
    title: 'Solidity 기초부터 실전까지',
    description: '스마트 컨트랙트 개발 입문',
    lessons: 42,
    duration: '8시간',
    level: '입문',
    category: '개발',
    isFree: false,
    progress: 0,
  },
]

export default function Home() {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const freeCourses = COURSES.filter(c => c.isFree)
  const membershipCourses = COURSES.filter(c => !c.isFree)
  const inProgressCourses = COURSES.filter(c => c.progress > 0)

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen bg-[#16162a] border-r border-white/5 z-40 transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-60'}`}>
        {/* Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/5">
          {!sidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-sm font-bold">
                TP
              </div>
              <span className="font-semibold">Academy</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-white/5 rounded-lg transition"
          >
            <svg className={`w-5 h-5 text-gray-400 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {SIDEBAR_MENU.map((section, i) => (
            <div key={i} className="mb-6">
              {!sidebarCollapsed && (
                <p className="px-4 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {section.section}
                </p>
              )}
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition ${isActive
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      } ${sidebarCollapsed ? 'justify-center' : ''}`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* User / Login */}
        <div className="p-4 border-t border-white/5">
          {sidebarCollapsed ? (
            <Link href="/login" className="block p-2 hover:bg-white/5 rounded-lg transition text-center">
              <span className="text-lg">👤</span>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="w-full border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
                로그인
              </Button>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        {/* Top Header */}
        <header className="h-16 bg-[#1a1a2e] border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">TokenPost Academy</h1>
            <Badge className="bg-blue-600/20 text-blue-400 text-xs">멤버십 전용</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="강의 검색..."
                className="w-64 h-9 pl-9 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Progress Section */}
          {inProgressCourses.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📖</span> 학습 중인 강의
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {inProgressCourses.map((course) => (
                  <Link key={course.id} href={`/courses/${course.slug}`}>
                    <div className="bg-[#252542] rounded-xl p-4 border border-white/5 hover:border-blue-500/30 transition group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">{course.category}</p>
                          <h3 className="font-medium group-hover:text-blue-400 transition">{course.title}</h3>
                        </div>
                        <Badge variant="outline" className="text-xs border-white/10 text-gray-400">
                          {course.level}
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>진행률</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 transition-all" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Free Courses */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🎁</span> 무료 강의
              <Badge className="bg-green-500/20 text-green-400 text-xs ml-2">FREE</Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {freeCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <div className="bg-[#252542] rounded-xl p-4 border border-green-500/20 hover:border-green-500/50 transition group">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-green-500/20 text-green-400 text-xs">무료</Badge>
                      <span className="text-xs text-gray-500">{course.duration}</span>
                    </div>
                    <h3 className="font-medium mt-2 group-hover:text-green-400 transition">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <span>{course.lessons}개 레슨</span>
                      <span>·</span>
                      <span>{course.level}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Membership Courses */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🔐</span> 멤버십 전용 강의
              <Badge className="bg-blue-500/20 text-blue-400 text-xs ml-2">MEMBERS</Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {membershipCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <div className="bg-[#252542] rounded-xl p-4 border border-white/5 hover:border-blue-500/30 transition group">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">멤버십</Badge>
                      <span className="text-xs text-gray-500">{course.duration}</span>
                    </div>
                    <h3 className="font-medium mt-2 group-hover:text-blue-400 transition">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-gray-500">
                        <span>{course.lessons}개 레슨</span>
                        <span className="mx-1">·</span>
                        <span>{course.level}</span>
                      </div>
                      <Badge variant="outline" className="text-xs border-white/10 text-gray-500">
                        {course.category}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Membership Banner */}
          <section className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-white/5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">토큰포스트 멤버십</h3>
                <p className="text-sm text-gray-400">
                  멤버십 회원은 모든 프리미엄 강의를 무제한으로 시청할 수 있습니다
                </p>
              </div>
              <a href="https://www.tokenpost.kr/membership" target="_blank" rel="noopener noreferrer">
                <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
                  멤버십 알아보기 →
                </Button>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
