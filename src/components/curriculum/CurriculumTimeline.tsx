'use client'

import React from 'react'
import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CourseWithStats } from '@/actions/courses'

interface CurriculumTimelineProps {
    courses: CourseWithStats[]
}

const PHASE_COLORS = [
    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500' },
    { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
    { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
    { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
    { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-500' },
    { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
    { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-500' },
]

export function CurriculumTimeline({ courses }: CurriculumTimelineProps) {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-white mb-4">학습 로드맵</h1>
                <p className="text-slate-400">
                    지속적으로 업데이트되는 커리큘럼을 통해 체계적인 학습 로드맵을 따라가세요.
                </p>
            </div>

            <div className="relative pl-8 border-l border-white/10 space-y-8">
                {courses.length === 0 && (
                    <div className="text-slate-500 text-sm">
                        아직 등록된 커리큘럼이 없습니다.
                    </div>
                )}

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {courses.map((course, index) => {
                        const phaseIndex = index // Or derived from course.phase if available
                        const colors = PHASE_COLORS[phaseIndex] || PHASE_COLORS[0]
                        const isPublished = course.status === 'published'

                        return (
                            <div key={course.id} className="relative">
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[41px] top-6 w-5 h-5 rounded-full border-4 border-slate-900 ${isPublished ? colors.dot : 'bg-slate-700'}`} />

                                <AccordionItem
                                    value={course.id}
                                    className={`border border-white/5 rounded-2xl bg-white/[0.02] overflow-hidden transition-all duration-300 ${isPublished ? 'hover:bg-white/5' : 'opacity-60 pointer-events-none'}`}
                                >
                                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                        <div className="flex flex-col items-start gap-1 text-left">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Badge
                                                    variant="outline"
                                                    className={`${colors.bg} ${colors.text} ${colors.border} border`}
                                                >
                                                    Phase {index + 1}
                                                </Badge>
                                                <span className="text-slate-500 text-xs font-normal">
                                                    {course.lessonsCount} Lessons
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white">
                                                {course.title}
                                            </h3>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-6">
                                        <div className="text-slate-400 mb-6 leading-relaxed">
                                            {course.description || "상세 설명이 없습니다."}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Link href={`/courses/${course.slug}`}>
                                                <Button className={`bg-gradient-to-r ${colors.dot.replace('bg-', 'from-').replace('500', '600')} to-slate-900 border border-white/10 hover:opacity-90 transition-opacity`}>
                                                    강의 보러가기
                                                </Button>
                                            </Link>
                                            {!isPublished && (
                                                <span className="text-sm text-yellow-500/80">
                                                    ⚠️ 준비 중인 과정입니다.
                                                </span>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </div>
                        )
                    })}
                </Accordion>
            </div>
        </div>
    )
}
