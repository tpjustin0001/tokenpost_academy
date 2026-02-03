/**
 * 라이브 방송 목록 페이지
 * 유튜브 라이브 임베드 및 날짜별 정렬
 */

import { Suspense } from 'react'
import { LiveList } from '@/components/live/LiveList'

export const metadata = {
    title: '라이브 | TokenPost Academy',
    description: 'TokenPost Academy 라이브 방송 시청하기',
}

export default function LivePage() {
    return (
        <div className="min-h-screen bg-background py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* 헤더 */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 dark:bg-red-500/20 rounded-full mb-4">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">LIVE</span>
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-4">라이브 방송</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        TokenPost Academy의 실시간 방송과 지난 방송을 시청하세요.
                    </p>
                </div>

                {/* 라이브 목록 */}
                <Suspense fallback={
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                }>
                    <LiveList />
                </Suspense>
            </div>
        </div>
    )
}
