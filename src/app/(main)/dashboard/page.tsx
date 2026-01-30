'use client'

/**
 * 사용자 대시보드 (마이페이지)
 */

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface UserInfo {
    email: string
    nickname: string
    uid?: string
    grade?: string
}

export default function DashboardPage() {
    const [user, setUser] = useState<UserInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // localStorage에서 사용자 정보 로드
        const userData = localStorage.getItem('user')
        if (userData) {
            setUser(JSON.parse(userData))
        }
        setIsLoading(false)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        document.cookie = 'mock-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        window.location.href = '/login'
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* 헤더 */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">내 대시보드</h1>
                        <p className="text-slate-400 mt-1">
                            안녕하세요, {user?.nickname || user?.email || '학습자'}님!
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        로그아웃
                    </Button>
                </div>

                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-slate-400">수강 중인 강의</CardDescription>
                            <CardTitle className="text-4xl font-bold text-white">0</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-slate-400">전체 진도율</CardDescription>
                            <CardTitle className="text-4xl font-bold text-white">0%</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-slate-400">획득 수료증</CardDescription>
                            <CardTitle className="text-4xl font-bold text-white">0</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* 내 강의 목록 */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">내 강의</CardTitle>
                        <CardDescription className="text-slate-400">
                            수강 중인 강의 목록입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-slate-500">
                            <p className="mb-4">아직 수강 중인 강의가 없습니다.</p>
                            <Link href="/courses">
                                <Button>강의 둘러보기</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* 프로필 정보 */}
                {user && (
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">프로필 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between py-2 border-b border-slate-700">
                                <span className="text-slate-400">이메일</span>
                                <span className="text-white">{user.email}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-700">
                                <span className="text-slate-400">닉네임</span>
                                <span className="text-white">{user.nickname || '-'}</span>
                            </div>
                            {user.grade && (
                                <div className="flex justify-between py-2">
                                    <span className="text-slate-400">회원 등급</span>
                                    <span className="text-white">{user.grade}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
