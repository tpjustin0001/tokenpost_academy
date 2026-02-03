'use client'

/**
 * 다음 추천 강의 사이드바
 * - 현재 코스의 다른 강의 목록
 * - 추천 강의 섹션
 */

import Link from 'next/link'
import { CourseWithModules, Lesson } from '@/actions/courses'

// Phase Gradients
const PHASE_GRADIENTS = [
    'bg-gradient-to-br from-emerald-500 to-teal-600',
    'bg-gradient-to-br from-blue-500 to-indigo-600',
    'bg-gradient-to-br from-violet-500 to-purple-600',
    'bg-gradient-to-br from-amber-500 to-orange-600',
    'bg-gradient-to-br from-rose-500 to-red-600',
    'bg-gradient-to-br from-cyan-500 to-blue-600',
    'bg-gradient-to-br from-fuchsia-500 to-pink-600',
]

function getGradient(phase: number) {
    return PHASE_GRADIENTS[(phase - 1) % PHASE_GRADIENTS.length] || PHASE_GRADIENTS[0]
}

interface RecommendedLessonsProps {
    course: any // Using any for flexibility with CourseWithModules and custom props
    currentLessonId: string
    allCourses?: any[]
}

export function RecommendedLessons({
    course,
    currentLessonId,
    allCourses = [],
}: RecommendedLessonsProps) {
    // 현재 코스의 모든 레슨
    const allLessons = course.modules?.flatMap((m: any) => m.lessons) || []
    const currentIndex = allLessons.findIndex((l: any) => l.id === currentLessonId)

    // 다음 강의들 (현재 강의 이후 최대 5개)
    const nextLessons = allLessons.slice(currentIndex + 1, currentIndex + 6)

    // 다른 코스에서 추천 강의 (무료 프리뷰 우선)
    const otherCourseRecommendations = allCourses
        .filter(c => c.id !== course.id)
        .flatMap(c =>
            c.modules?.flatMap((m: any) =>
                m.lessons.filter((l: any) => l.access_level === 'free').map((l: any) => ({
                    ...l,
                    course: c,
                }))
            ) || []
        )
        .slice(0, 4)

    return (
        <div className="space-y-6">
            {/* 다음 강의 섹션 */}
            {nextLessons.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-white mb-3">다음 강의</h3>
                    <div className="space-y-2">
                        {nextLessons.map((lesson: any, idx: number) => (
                            <LessonCard
                                key={lesson.id}
                                lesson={lesson}
                                courseSlug={course.slug}
                                index={currentIndex + idx + 2}
                                isSmall
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* 추천 강의 섹션 */}
            {otherCourseRecommendations.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-white mb-3">다음 추천 강의</h3>
                    <div className="space-y-3">
                        {otherCourseRecommendations.map((item: any) => (
                            <Link
                                key={item.id}
                                href={`/courses/${item.course.slug}/lesson/${item.id}`}
                                className="flex gap-3 p-2 -mx-2 rounded-lg hover:bg-white/5 transition group"
                            >
                                {/* 썸네일 */}
                                <div className="w-24 h-14 rounded bg-gradient-to-br from-slate-700 to-slate-800 flex-shrink-0 overflow-hidden">
                                    <div className={`w-full h-full ${getGradient(item.course.phase || 1)} opacity-60`} />
                                </div>

                                {/* 정보 */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-medium line-clamp-2 group-hover:text-blue-400 transition">
                                        {item.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-slate-500">Phase {item.course.phase || 1}</span>
                                        <span className="text-xs text-slate-600">•</span>
                                        <span className="text-xs text-slate-500">{item.duration || '준비 중'}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

interface LessonCardProps {
    lesson: Lesson
    courseSlug: string
    index: number
    isSmall?: boolean
}

function LessonCard({ lesson, courseSlug, index, isSmall }: LessonCardProps) {
    return (
        <Link
            href={`/courses/${courseSlug}/lesson/${lesson.id}`}
            className={`flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-white/5 transition group ${isSmall ? '' : 'py-3'
                }`}
        >
            {/* 번호 */}
            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-400 flex-shrink-0">
                {index}
            </div>

            {/* 정보 */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate group-hover:text-blue-400 transition">
                    {lesson.title}
                </p>
                <span className="text-xs text-slate-500">{lesson.duration || '-'}</span>
            </div>

            {/* 재생 아이콘 */}
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
        </Link>
    )
}

/**
 * 강의 목록 그리드 컴포넌트 (전체 강의 페이지용)
 */
interface CourseGridProps {
    courses: any[]
}

export function CourseGrid({ courses }: CourseGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map(course => (
                <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="group block"
                >
                    {/* 썸네일 */}
                    <div className="aspect-video rounded-lg overflow-hidden bg-slate-800 mb-3 relative">
                        <div className={`w-full h-full ${getGradient(course.phase || 1)} flex items-center justify-center`}>
                            <span className="text-4xl font-bold text-white/20">
                                Phase {course.phase || 1}
                            </span>
                        </div>

                        {/* 무료 배지 */}
                        {course.access_level === 'free' && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500 text-white">
                                무료 공개
                            </span>
                        )}

                        {/* 호버 오버레이 */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* 정보 */}
                    <h3 className="font-medium text-white group-hover:text-blue-400 transition line-clamp-2 mb-1">
                        {course.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-1 mb-2">
                        {course.subtitle || course.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>Phase {course.phase || 1}</span>
                        <span>•</span>
                        <span>{course.lessonsCount || 0}개 강의</span>
                        <span>•</span>
                        <span>{course.duration || '준비 중'}</span>
                    </div>
                </Link>
            ))}
        </div>
    )
}

/**
 * 사용자 프로필 진행률 카드
 */
interface ProgressCardProps {
    totalProgress: number
    completedLessons: number
    totalLessons: number
}

export function ProgressCard({
    totalProgress,
    completedLessons,
    totalLessons,
}: ProgressCardProps) {
    return (
        <div className="bg-slate-900 rounded-xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-lg">🚀</span>
                <h3 className="font-semibold text-white">학습 진행률</h3>
            </div>

            {/* 프로그레스 바 */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">PROGRESS</span>
                    <span className="text-blue-400 font-medium">{totalProgress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${totalProgress}%` }}
                    />
                </div>
            </div>

            {/* 통계 */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">완료한 강의</span>
                <span className="text-white font-medium">{completedLessons} / {totalLessons}</span>
            </div>

            {/* CTA */}
            <button className="w-full mt-4 py-2.5 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition">
                전체 수강 후 배움
            </button>
        </div>
    )
}
