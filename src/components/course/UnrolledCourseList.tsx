"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getUserStatus } from '@/actions/user'
import { Lock } from 'lucide-react'

interface Course {
    id: string
    title: string
    slug: string
    thumbnail_url?: string
    access_level: string
    modules?: {
        id: string
        title: string
        lessons?: {
            id: string
            title: string
            duration?: string
            access_level: string
        }[]
    }[]
}

export function UnrolledCourseList({ courses }: { courses: Course[] }) {
    const [authStatus, setAuthStatus] = useState<{ isLoggedIn: boolean; hasMembership: boolean } | null>(null)

    useEffect(() => {
        getUserStatus().then(setAuthStatus)
    }, [])

    return (
        <div className="space-y-12">
            {courses.map((course) => (
                <div key={course.id} className="space-y-6">
                    {/* Course Header */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Thumbnail */}
                        <div className="w-full md:w-64 aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm flex-shrink-0 relative">
                            {course.thumbnail_url ? (
                                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-4xl">🎓</div>
                            )}
                        </div>

                        {/* Course Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">{course.access_level === 'free' ? '무료 과정' : '멤버십 과정'}</Badge>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                            <p className="text-muted-foreground mb-4">Phase 1 · 총 {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} 레슨</p>
                        </div>
                    </div>

                    {/* Modules & Lessons */}
                    <div className="grid gap-6 pl-0 md:pl-6">
                        {course.modules?.map((module, mIdx) => (
                            <Card key={module.id} className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-white/5 font-semibold flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center text-slate-600 dark:text-slate-300">
                                        {mIdx + 1}
                                    </span>
                                    {module.title}
                                </div>
                                <div className="p-2 space-y-1">
                                    {module.lessons?.map((lesson, lIdx) => {
                                        // Access Logic
                                        const isLocked = lesson.access_level !== 'free' && (!authStatus?.isLoggedIn || !authStatus?.hasMembership)

                                        return (
                                            <div key={lesson.id} className="group relative">
                                                <Link
                                                    href={isLocked ? '#' : `/courses/${course.slug}/lesson/${lesson.id}`}
                                                    className={`
                                                        flex items-center justify-between p-3 rounded-lg transition-all
                                                        ${isLocked
                                                            ? 'cursor-not-allowed opacity-70 hover:bg-slate-100/50 dark:hover:bg-white/5'
                                                            : 'hover:bg-white dark:hover:bg-white/10 hover:shadow-sm'
                                                        }
                                                    `}
                                                    onClick={(e) => {
                                                        if (isLocked) e.preventDefault()
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 flex justify-center text-sm text-muted-foreground font-mono">
                                                            {lIdx + 1 < 10 ? `0${lIdx + 1}` : lIdx + 1}
                                                        </div>
                                                        <span className={`text-sm font-medium ${isLocked ? 'text-slate-500' : 'text-foreground'}`}>
                                                            {lesson.title}
                                                        </span>
                                                        {lesson.access_level === 'free' && (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                                Free
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <span className="text-xs text-muted-foreground font-mono">
                                                            {lesson.duration || '10:00'}
                                                        </span>
                                                        {isLocked && <Lock className="w-4 h-4 text-slate-400" />}
                                                    </div>
                                                </Link>

                                                {/* Tooltip for Locked Items - Simple implementation */}
                                                {isLocked && (
                                                    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/10 dark:bg-white/5 pointer-events-none rounded-lg">
                                                        <span className="bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
                                                            {authStatus?.isLoggedIn ? '멤버십 필요' : '로그인 필요'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
