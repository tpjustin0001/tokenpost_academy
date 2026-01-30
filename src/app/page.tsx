'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 사이드바 메뉴
const SIDEBAR_MENU = [
  { icon: '🏠', label: '홈', href: '/' },
  { icon: '📚', label: '전체 강의', href: '/courses' },
  { icon: '📊', label: '내 학습', href: '/my-courses' },
  { type: 'divider' },
  { icon: '⛓️', label: '블록체인', href: '/category/blockchain' },
  { icon: '💰', label: 'DeFi', href: '/category/defi' },
  { icon: '🖼️', label: 'NFT', href: '/category/nft' },
  { icon: '📈', label: '트레이딩', href: '/category/trading' },
  { icon: '⚙️', label: '개발', href: '/category/development' },
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
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'web3-fundamentals',
    slug: 'web3-fundamentals',
    title: '웹3 핵심 개념',
    description: '블록체인부터 DeFi까지 Web3의 모든 것',
    lessons: 24,
    duration: '4시간 30분',
    level: '입문',
    category: '블록체인',
    isFree: false,
    progress: 45,
    gradient: 'from-blue-500 to-indigo-600',
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
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'nft-development',
    slug: 'nft-development',
    title: 'NFT 스마트 컨트랙트',
    description: 'ERC-721/1155 실전 개발 가이드',
    lessons: 18,
    duration: '3시간 45분',
    level: '고급',
    category: 'NFT',
    isFree: false,
    progress: 0,
    gradient: 'from-orange-500 to-rose-600',
  },
  {
    id: 'crypto-trading',
    slug: 'crypto-trading',
    title: '암호화폐 트레이딩',
    description: '차트 분석과 리스크 관리 실전',
    lessons: 30,
    duration: '5시간 30분',
    level: '중급',
    category: '트레이딩',
    isFree: false,
    progress: 20,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'solidity-basics',
    slug: 'solidity-basics',
    title: 'Solidity 개발 입문',
    description: '스마트 컨트랙트 개발의 첫 걸음',
    lessons: 42,
    duration: '8시간',
    level: '입문',
    category: '개발',
    isFree: false,
    progress: 0,
    gradient: 'from-violet-500 to-purple-600',
  },
]

export default function Home() {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const freeCourses = COURSES.filter(c => c.isFree)
  const membershipCourses = COURSES.filter(c => !c.isFree)
  const inProgressCourses = COURSES.filter(c => c.progress > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen backdrop-blur-xl bg-black/40 border-r border-white/5 z-40 transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo */}
        <div className="h-20 px-5 flex items-center justify-between">
          {!sidebarCollapsed && (
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/20">
                TP
              </div>
              <div className="flex flex-col">
                <span className="font-semibold tracking-tight">TokenPost</span>
                <span className="text-xs text-slate-400 -mt-0.5">Academy</span>
              </div>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/20 mx-auto">
              TP
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {SIDEBAR_MENU.map((item, i) => {
            if (item.type === 'divider') {
              return <div key={i} className="my-4 border-t border-white/5" />
            }
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href || '#'}
                className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-white/10 shadow-lg shadow-blue-500/5'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  } ${sidebarCollapsed ? 'justify-center px-3' : ''}`}
              >
                <span className="text-xl">{item.icon}</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition"
          >
            <svg className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Login */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-white/5">
            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-blue-500/20">
                로그인
              </Button>
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`relative transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/60 border-b border-white/5">
          <div className="h-20 px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">강의 라이브러리</h1>
              <p className="text-sm text-slate-400 mt-0.5">토큰포스트 멤버십 전용 교육 플랫폼</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="강의 검색..."
                  className="w-72 h-11 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all backdrop-blur"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Progress Section */}
          {inProgressCourses.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                <h2 className="text-xl font-semibold">학습 중</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {inProgressCourses.map((course) => (
                  <Link key={course.id} href={`/courses/${course.slug}`}>
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${course.gradient} opacity-10 blur-3xl transition-opacity group-hover:opacity-20`} />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{course.category}</p>
                            <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">{course.title}</h3>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${course.gradient} text-white shadow-lg`}>
                            {course.progress}%
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">{course.description}</p>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${course.gradient} transition-all shadow-lg`} style={{ width: `${course.progress}%` }} />
                        </div>
                        <p className="text-xs text-slate-500 mt-3">{course.lessons}개 레슨 · {course.duration}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Free Courses */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
              <h2 className="text-xl font-semibold">무료 강의</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                FREE
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {freeCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-emerald-500/20 p-5 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${course.gradient} opacity-10 blur-2xl`} />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                          무료
                        </span>
                        <span className="text-xs text-slate-500">{course.duration}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-400 transition-colors">{course.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5 text-xs text-slate-500">
                        <span>{course.lessons}개 레슨</span>
                        <span>·</span>
                        <span>{course.level}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Membership Courses */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
              <h2 className="text-xl font-semibold">멤버십 전용</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                MEMBERS
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {membershipCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${course.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`} />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/20 text-blue-400">
                          멤버십
                        </span>
                        <span className="text-xs text-slate-500">{course.duration}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <span className="text-xs text-slate-500">{course.lessons}개 레슨 · {course.level}</span>
                        <span className="text-xs text-slate-600">{course.category}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Membership Banner */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 border border-white/10 p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">토큰포스트 멤버십</h3>
                <p className="text-slate-400">
                  모든 프리미엄 강의 무제한 시청 · 전문가 리서치 · 프리미엄 뉴스
                </p>
              </div>
              <a href="https://www.tokenpost.kr/membership" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 shadow-xl shadow-white/10">
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
