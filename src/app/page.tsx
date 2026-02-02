'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ALL_COURSES, getTotalLessons, getTotalDuration } from '@/data/courses'

// Phase 컬러
const PHASE_COLORS = [
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
  { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
  { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
  { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-500' },
  { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
  { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-500' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative">
        {/* Top Header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/60 border-b border-white/5">
          <div className="h-20 px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">커리큘럼</h1>
              <p className="text-sm text-slate-400 mt-0.5">총 {getTotalLessons()}개 강의 · {getTotalDuration()}</p>
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
          {/* Hero Banner */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-blue-600/20 border border-white/10 p-8 mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <p className="text-sm font-medium text-blue-400 mb-2">TokenPost Academy</p>
              <h2 className="text-3xl font-bold mb-3">암호화폐 투자 마스터 코스</h2>
              <p className="text-slate-400 max-w-2xl mb-6">
                입문부터 고급까지, 7개의 Phase로 구성된 체계적인 커리큘럼으로
                암호화폐 투자의 모든 것을 배워보세요.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{getTotalLessons()}개 강의</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{getTotalDuration()}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>7개 Phase</span>
                </div>
              </div>
            </div>
          </section>

          {/* Course Grid */}
          <div className="space-y-6">
            {ALL_COURSES.map((course, i) => {
              const colors = PHASE_COLORS[i]
              return (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border ${colors.border} p-6 hover:border-white/20 transition-all duration-300 hover:shadow-xl`}>
                    <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${course.gradient} opacity-5 blur-3xl transition-opacity group-hover:opacity-10`} />

                    <div className="relative flex flex-col md:flex-row md:items-center gap-4">
                      {/* Phase Badge */}
                      <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center`}>
                        <span className={`text-2xl font-bold ${colors.text}`}>{course.phase}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                            {course.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {course.level}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-2">{course.subtitle}</p>
                        <p className="text-sm text-slate-400 line-clamp-2">{course.description}</p>
                      </div>

                      {/* Meta */}
                      <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-1 text-sm text-slate-500">
                        <span>{course.lessonsCount}개 강의</span>
                        <span>{course.duration}</span>
                      </div>

                      {/* Arrow */}
                      <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/5 group-hover:bg-blue-500/20 transition-colors">
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Membership Banner */}
          <section className="mt-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 border border-white/10 p-8">
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
                  멤버십 알아보기
                </Button>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
