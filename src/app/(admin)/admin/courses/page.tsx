/**
 * 강의 관리 페이지
 * 강의 목록, 생성, 수정, 삭제
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getCourses } from '@/actions/courses'

function getStatusBadge(status: string) {
    switch (status) {
        case 'published':
            return <Badge className="bg-green-500/20 text-green-400">게시됨</Badge>
        case 'draft':
            return <Badge className="bg-yellow-500/20 text-yellow-400">초안</Badge>
        case 'archived':
            return <Badge className="bg-slate-500/20 text-slate-400">보관됨</Badge>
        default:
            return null
    }
}

function getAccessBadge(accessLevel: string) {
    switch (accessLevel) {
        case 'free':
            return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🆓 무료</Badge>
        case 'plus':
            return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">⭐ Plus</Badge>
        case 'alpha':
            return <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">👑 Alpha</Badge>
        default:
            return <Badge className="bg-slate-500/20 text-slate-400">구독</Badge>
    }
}

export default async function AdminCoursesPage() {
    const courses = await getCourses()

    return (
        <div className="p-6 space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">강의 관리</h1>
                    <p className="text-slate-400 mt-1">강의를 생성하고 관리합니다</p>
                </div>
                <Link href="/admin/courses/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                        + 새 강의 만들기
                    </Button>
                </Link>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-400">전체 강의</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-white">{courses.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-400">게시됨</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-400">
                            {courses.filter(c => c.status === 'published').length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-400">초안</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-yellow-400">
                            {courses.filter(c => c.status === 'draft').length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-400">무료 강의</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-emerald-400">
                            {courses.filter(c => c.access_level === 'free').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 강의 목록 테이블 */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">전체 강의</CardTitle>
                </CardHeader>
                <CardContent>
                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400 mb-4">아직 등록된 강의가 없습니다</p>
                            <Link href="/admin/courses/new">
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                                    첫 강의 만들기
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-700">
                                    <TableHead className="text-slate-400">강의명</TableHead>
                                    <TableHead className="text-slate-400">상태</TableHead>
                                    <TableHead className="text-slate-400">접근 권한</TableHead>
                                    <TableHead className="text-slate-400">생성일</TableHead>
                                    <TableHead className="text-slate-400 w-32"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.map((course) => (
                                    <TableRow key={course.id} className="border-slate-700">
                                        <TableCell>
                                            <Link
                                                href={`/admin/courses/${course.id}`}
                                                className="text-white hover:text-blue-400 transition font-medium"
                                            >
                                                {course.title}
                                            </Link>
                                            <p className="text-xs text-slate-500 mt-1">/{course.slug}</p>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(course.status)}</TableCell>
                                        <TableCell>{getAccessBadge(course.access_level)}</TableCell>
                                        <TableCell className="text-slate-400 text-sm">
                                            {new Date(course.created_at).toLocaleDateString('ko-KR')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 justify-end">
                                                <Link href={`/admin/courses/${course.id}/lessons`}>
                                                    <Button size="sm" variant="outline" className="text-xs">
                                                        📚 커리큘럼
                                                    </Button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <span className="text-lg">⋮</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/courses/${course.id}`}>
                                                                수정
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/courses/${course.id}/lessons`}>
                                                                레슨 관리
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-400">
                                                            삭제
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
