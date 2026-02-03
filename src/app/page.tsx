/**
 * 메인 홈페이지
 * TokenPost Academy 유저 전용 - 강의와 커리큘럼 소개
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCourses } from '@/actions/courses'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'


// Phase 컬러
const PHASE_COLORS = [
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-500 dark:text-emerald-400', dot: 'bg-emerald-500' },
  { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500 dark:text-blue-400', dot: 'bg-blue-500' },
  { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-500 dark:text-yellow-400', dot: 'bg-yellow-500' },
  { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-500 dark:text-orange-400', dot: 'bg-orange-500' },
  { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500 dark:text-purple-400', dot: 'bg-purple-500' },
  { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500 dark:text-red-400', dot: 'bg-red-500' },
  { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-500' },
]

export const dynamic = 'force-dynamic'

export default async function Home(props: { searchParams: Promise<{ level?: string }> }) {
  const searchParams = await props.searchParams
  const courses = await getCourses()
  const levelFilter = searchParams.level

  const filteredCourses = levelFilter
    ? courses.filter(c => c.access_level === levelFilter)
    : courses

  // 통계 계산
  const totalLessons = courses.reduce((acc, course) => acc + (course.lessonsCount || 0), 0)

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/40 via-transparent to-transparent dark:from-blue-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-200/40 via-transparent to-transparent dark:from-purple-900/10" />
      </div>

      {/* Main Content */}
      <div className="relative">
        {/* Top Header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border transition-colors duration-300">
          <div className="h-20 px-4 md:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">커리큘럼</h1>
              <p className="text-sm text-muted-foreground mt-0.5">총 {totalLessons}개 강의</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="강의 검색..."
                  className="w-72 h-11 pl-11 pr-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/50 dark:focus:bg-white/10 transition-all backdrop-blur"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8">
          {/* Hero Banner with Filters */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-blue-600/10 dark:from-blue-600/20 dark:via-purple-600/10 dark:to-blue-600/20 border border-blue-200 dark:border-white/10 p-8 mb-12 shadow-sm dark:shadow-none">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50 dark:opacity-100" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-50 dark:opacity-100" />

            <div className="relative flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">TokenPost Academy</p>
                <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">암호화폐 투자 마스터 코스</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mb-6">
                  입문부터 고급까지, TokenPost Academy의 체계적인 커리큘럼으로
                  암호화폐 투자의 모든 것을 배워보세요.
                </p>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Link href="/">
                    <Button variant={!levelFilter ? "secondary" : "ghost"} size="sm" className="rounded-full">
                      전체
                    </Button>
                  </Link>
                  <Link href="/?level=free">
                    <Button variant={levelFilter === 'free' ? "secondary" : "ghost"} size="sm" className="rounded-full">
                      입문 (Free)
                    </Button>
                  </Link>
                  <Link href="/?level=plus">
                    <Button variant={levelFilter === 'plus' ? "secondary" : "ghost"} size="sm" className="rounded-full">
                      중급 (Plus)
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm flex-shrink-0">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{totalLessons}개 강의</span>
                </div>
              </div>
            </div>
          </section>

          {/* Course List (TOC Style) */}
          {/* Course List (Grid Style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
                <p className="text-xl mb-2 text-foreground">등록된 강의가 없습니다.</p>
                <p className="text-sm">해당 레벨의 강의가 없거나, 아직 등록되지 않았습니다.</p>
              </div>
            ) : (
              filteredCourses.filter((c: any) => c.status === 'published').map((course) => (
                <div key={course.id} className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-500/50 dark:hover:border-blue-500/50">
                  {/* Card Header (Bg Pattern) */}
                  <div className={`h-32 w-full relative overflow-hidden ${course.access_level === 'free' ? 'bg-emerald-500/10' :
                      course.access_level === 'plus' ? 'bg-blue-500/10' : 'bg-purple-500/10'
                    }`}>
                    <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-sm
                            ${course.access_level === 'free' ? 'text-emerald-600 bg-white/90 border-emerald-200 dark:bg-black/50 dark:text-emerald-400 dark:border-emerald-500/30' :
                        course.access_level === 'plus' ? 'text-blue-600 bg-white/90 border-blue-200 dark:bg-black/50 dark:text-blue-400 dark:border-blue-500/30' :
                          'text-purple-600 bg-white/90 border-purple-200 dark:bg-black/50 dark:text-purple-400 dark:border-purple-500/30'
                      }`}>
                      {course.access_level === 'free' ? 'Free' : (course.access_level === 'plus' ? 'Plus' : 'Alpha')}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <Link href={`/courses/${course.slug}`} className="block mb-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                    </Link>

                    {course.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                        {course.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>총 {course.lessonsCount}강</span>
                      </div>
                      <Link href={`/courses/${course.slug}`}>
                        <Button size="sm" variant="ghost" className="gap-1 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 -mr-2">
                          강의 보러가기
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Membership Banner */}
          <section className="mt-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-blue-600/10 border border-blue-200 dark:border-white/10 p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50 dark:opacity-100" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50 dark:opacity-100" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">토큰포스트 멤버십</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  모든 프리미엄 강의 무제한 시청 · 전문가 리서치 · 프리미엄 뉴스
                </p>
              </div>
              <a href="https://www.tokenpost.kr/membership" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold px-8 shadow-xl shadow-blue-500/10 dark:shadow-white/10">
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
