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

// TODO: Supabase에서 실제 데이터 조회
const MOCK_COURSES = [
    {
        id: 'web3-fundamentals',
        title: '웹3 핵심 개념 완벽 정리',
        status: 'published',
        instructor: '김토큰',
        enrollments: 1234,
        lessons: 24,
        price: 99000,
        createdAt: '2024-01-15',
    },
    {
        id: 'defi-masterclass',
        title: 'DeFi 마스터클래스',
        status: 'published',
        instructor: '이디파이',
        enrollments: 856,
        lessons: 36,
        price: 149000,
        createdAt: '2024-01-10',
    },
    {
        id: 'nft-development',
        title: 'NFT 개발 실전 가이드',
        status: 'draft',
        instructor: '박엔프티',
        enrollments: 0,
        lessons: 12,
        price: 129000,
        createdAt: '2024-01-28',
    },
]

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

export default function AdminCoursesPage() {
    return (
        <div className="p-6 space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">강의 관리</h1>
                    <p className="text-slate-400 mt-1">모든 강의를 관리합니다.</p>
                </div>
                <Link href="/admin/courses/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        + 새 강의
                    </Button>
                </Link>
            </div>

            {/* 강의 테이블 */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">전체 강의</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-700">
                                <TableHead className="text-slate-400">강의명</TableHead>
                                <TableHead className="text-slate-400">상태</TableHead>
                                <TableHead className="text-slate-400">강사</TableHead>
                                <TableHead className="text-slate-400 text-right">수강생</TableHead>
                                <TableHead className="text-slate-400 text-right">레슨</TableHead>
                                <TableHead className="text-slate-400 text-right">가격</TableHead>
                                <TableHead className="text-slate-400 w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_COURSES.map((course) => (
                                <TableRow key={course.id} className="border-slate-700">
                                    <TableCell>
                                        <Link
                                            href={`/admin/courses/${course.id}`}
                                            className="text-white hover:text-blue-400 transition font-medium"
                                        >
                                            {course.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(course.status)}</TableCell>
                                    <TableCell className="text-slate-300">{course.instructor}</TableCell>
                                    <TableCell className="text-right text-slate-300">
                                        {course.enrollments.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right text-slate-300">
                                        {course.lessons}
                                    </TableCell>
                                    <TableCell className="text-right text-slate-300">
                                        ₩{course.price.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
