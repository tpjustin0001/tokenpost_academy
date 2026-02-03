/**
 * Admin 라이브 관리 페이지
 */

import { Suspense } from 'react'
import { LivesManager } from '@/components/admin/LivesManager'
import { getLives } from '@/actions/lives'

export default async function AdminLivesPage() {
    const lives = await getLives()

    return (
        <div className="p-6 space-y-6">
            {/* 페이지 헤더 */}
            <div>
                <h1 className="text-3xl font-bold text-white">라이브 관리</h1>
                <p className="text-slate-400 mt-1">유튜브 라이브 및 VOD를 관리합니다.</p>
            </div>

            {/* 라이브 관리 컴포넌트 */}
            <Suspense fallback={
                <div className="p-8 text-center text-slate-400">
                    로딩 중...
                </div>
            }>
                <LivesManager initialLives={lives} />
            </Suspense>
        </div>
    )
}
