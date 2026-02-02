'use client'

/**
 * 분석 대시보드
 * 수강 현황, 인기 강의, 이탈률 분석
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    getEnrollments,
    getEnrollmentStats,
    getPopularCourses,
    getCourseDropoffAnalysis,
    type Enrollment,
    type PopularCourse,
    type LessonDropoff
} from '@/actions/analytics'
import { getCourses, type Course } from '@/actions/courses'

export default function AdminAnalyticsPage() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ total: 0, completed: 0, recent: 0, completionRate: 0 })
    const [enrollments, setEnrollments] = useState<Enrollment[]>([])
    const [popularCourses, setPopularCourses] = useState<PopularCourse[]>([])
    const [courses, setCourses] = useState<Course[]>([])

    // 이탈 분석
    const [selectedCourseId, setSelectedCourseId] = useState<string>('')
    const [dropoffData, setDropoffData] = useState<LessonDropoff[]>([])
    const [dropoffLoading, setDropoffLoading] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const [statsData, enrollmentsData, popularData, coursesData] = await Promise.all([
            getEnrollmentStats(),
            getEnrollments({ limit: 10 }),
            getPopularCourses(5),
            getCourses()
        ])
        setStats(statsData)
        setEnrollments(enrollmentsData)
        setPopularCourses(popularData)
        setCourses(coursesData)
        setLoading(false)
    }

    const loadDropoffAnalysis = async (courseId: string) => {
        if (!courseId) return
        setDropoffLoading(true)
        const data = await getCourseDropoffAnalysis(courseId)
        setDropoffData(data)
        setDropoffLoading(false)
    }

    const handleCourseSelect = (courseId: string) => {
        setSelectedCourseId(courseId)
        loadDropoffAnalysis(courseId)
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-slate-400">로딩 중...</div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* 페이지 헤더 */}
            <div>
                <h1 className="text-3xl font-bold text-white">분석</h1>
                <p className="text-slate-400 mt-1">수강 현황, 인기 강의, 이탈률을 분석합니다.</p>
            </div>

            {/* 수강 통계 카드 */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                        <div className="text-sm text-slate-400">총 수강 등록</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-emerald-400">{stats.completed}</div>
                        <div className="text-sm text-slate-400">완료된 수강</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-400">{stats.recent}</div>
                        <div className="text-sm text-slate-400">최근 7일 신규</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-purple-400">{stats.completionRate}%</div>
                        <div className="text-sm text-slate-400">전체 완료율</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* 인기 강의 */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">🔥 인기 강의</CardTitle>
                        <CardDescription className="text-slate-400">
                            수강 등록 수 기준 상위 강의
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {popularCourses.length === 0 ? (
                            <div className="py-8 text-center text-slate-400">
                                아직 수강 데이터가 없습니다
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {popularCourses.map((course, index) => (
                                    <div
                                        key={course.course_id}
                                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl font-bold text-slate-500">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="text-white font-medium">{course.title}</p>
                                                <div className="flex gap-2 mt-1">
                                                    <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                                                        {course.enrollment_count}명 수강
                                                    </Badge>
                                                    <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                                                        완료율 {course.completion_rate}%
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-slate-400">평균 진도</div>
                                            <div className="text-lg font-bold text-white">
                                                {course.avg_progress}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 최근 수강 신청 */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">📋 최근 수강 신청</CardTitle>
                        <CardDescription className="text-slate-400">
                            최근 등록된 수강 내역
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {enrollments.length === 0 ? (
                            <div className="py-8 text-center text-slate-400">
                                아직 수강 신청이 없습니다
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {enrollments.map((enrollment) => (
                                    <div
                                        key={enrollment.id}
                                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                                    >
                                        <div>
                                            <p className="text-white font-medium">
                                                {enrollment.user?.nickname || enrollment.user?.email || 'Unknown'}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                {enrollment.course?.title || 'Unknown Course'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={
                                                enrollment.progress_percent === 100
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-slate-500/20 text-slate-400'
                                            }>
                                                {enrollment.progress_percent || 0}%
                                            </Badge>
                                            <div className="text-xs text-slate-500 mt-1">
                                                {new Date(enrollment.enrolled_at).toLocaleDateString('ko-KR')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* 이탈 분석 */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">📉 이탈 분석</CardTitle>
                            <CardDescription className="text-slate-400">
                                레슨별 시청 시작 vs 완료 비교 - 어디서 이탈이 많은지 확인
                            </CardDescription>
                        </div>
                        <Select value={selectedCourseId} onValueChange={handleCourseSelect}>
                            <SelectTrigger className="w-64 bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder="강의를 선택하세요" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                {courses.map((course) => (
                                    <SelectItem key={course.id} value={course.id}>
                                        {course.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {!selectedCourseId ? (
                        <div className="py-12 text-center text-slate-400">
                            강의를 선택하면 레슨별 이탈률을 확인할 수 있습니다
                        </div>
                    ) : dropoffLoading ? (
                        <div className="py-12 text-center text-slate-400">분석 중...</div>
                    ) : dropoffData.length === 0 ? (
                        <div className="py-12 text-center text-slate-400">
                            아직 시청 데이터가 없습니다
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-700">
                                    <TableHead className="text-slate-400 w-12">#</TableHead>
                                    <TableHead className="text-slate-400">레슨</TableHead>
                                    <TableHead className="text-slate-400">모듈</TableHead>
                                    <TableHead className="text-slate-400 text-center">시청 시작</TableHead>
                                    <TableHead className="text-slate-400 text-center">완료</TableHead>
                                    <TableHead className="text-slate-400 text-center">이탈률</TableHead>
                                    <TableHead className="text-slate-400 w-40">시각화</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dropoffData.map((lesson) => (
                                    <TableRow key={lesson.lesson_id} className="border-slate-700">
                                        <TableCell className="text-slate-500">{lesson.position}</TableCell>
                                        <TableCell className="text-white font-medium">{lesson.lesson_title}</TableCell>
                                        <TableCell className="text-slate-400">{lesson.module_title}</TableCell>
                                        <TableCell className="text-center text-white">{lesson.started_count}</TableCell>
                                        <TableCell className="text-center text-emerald-400">{lesson.completed_count}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={
                                                lesson.dropoff_rate > 50
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : lesson.dropoff_rate > 30
                                                        ? 'bg-yellow-500/20 text-yellow-400'
                                                        : 'bg-emerald-500/20 text-emerald-400'
                                            }>
                                                {lesson.dropoff_rate}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${lesson.dropoff_rate > 50
                                                            ? 'bg-red-500'
                                                            : lesson.dropoff_rate > 30
                                                                ? 'bg-yellow-500'
                                                                : 'bg-emerald-500'
                                                        }`}
                                                    style={{ width: `${100 - lesson.dropoff_rate}%` }}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
