'use client'

/**
 * 라이브 방송 목록 컴포넌트
 * 유튜브 라이브/VOD 임베드 및 날짜별 정렬
 */

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowUpDown } from 'lucide-react'

// 임시 더미 데이터 (추후 Supabase에서 가져오기)
const DUMMY_LIVES = [
    {
        id: '1',
        title: '비트코인 시장 분석 라이브',
        description: '주간 비트코인 시장 분석과 전망을 실시간으로 함께합니다.',
        youtubeId: 'dQw4w9WgXcQ',
        thumbnailUrl: null,
        isLive: true,
        scheduledAt: new Date().toISOString(),
        duration: null,
    },
    {
        id: '2',
        title: '이더리움 2.0 업데이트 총정리',
        description: '이더리움의 최신 업데이트와 향후 로드맵을 분석합니다.',
        youtubeId: 'dQw4w9WgXcQ',
        thumbnailUrl: null,
        isLive: false,
        scheduledAt: new Date(Date.now() - 86400000).toISOString(), // 어제
        duration: '1:23:45',
    },
    {
        id: '3',
        title: '알트코인 시즌 투자 전략',
        description: '불장에서의 알트코인 투자 전략과 포트폴리오 구성법',
        youtubeId: 'dQw4w9WgXcQ',
        thumbnailUrl: null,
        isLive: false,
        scheduledAt: new Date(Date.now() - 172800000).toISOString(), // 2일 전
        duration: '58:30',
    },
]

type SortOrder = 'newest' | 'oldest'

export function LiveList() {
    const [lives, setLives] = useState(DUMMY_LIVES)
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
    const [selectedLive, setSelectedLive] = useState<typeof DUMMY_LIVES[0] | null>(null)

    // 날짜별 정렬
    useEffect(() => {
        const sorted = [...DUMMY_LIVES].sort((a, b) => {
            const dateA = new Date(a.scheduledAt).getTime()
            const dateB = new Date(b.scheduledAt).getTime()
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
        })
        setLives(sorted)
    }, [sortOrder])

    // 첫 번째 라이브를 기본 선택
    useEffect(() => {
        if (lives.length > 0 && !selectedLive) {
            // 라이브 중인 것이 있으면 우선, 아니면 최신
            const live = lives.find(l => l.isLive) || lives[0]
            setSelectedLive(live)
        }
    }, [lives, selectedLive])

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        })
    }

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-8">
            {/* 메인 플레이어 */}
            {selectedLive && (
                <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedLive.youtubeId}?autoplay=0&rel=0`}
                            title={selectedLive.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            {selectedLive.isLive && (
                                <Badge className="bg-red-500 text-white animate-pulse">
                                    🔴 LIVE
                                </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                                {formatDate(selectedLive.scheduledAt)}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">{selectedLive.title}</h2>
                        <p className="text-muted-foreground">{selectedLive.description}</p>
                    </div>
                </div>
            )}

            {/* 정렬 컨트롤 */}
            <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-lg font-semibold text-foreground">전체 방송</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                    className="gap-2"
                >
                    <ArrowUpDown className="w-4 h-4" />
                    {sortOrder === 'newest' ? '최신순' : '오래된순'}
                </Button>
            </div>

            {/* 방송 목록 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lives.map((live) => (
                    <Card
                        key={live.id}
                        className={`group cursor-pointer overflow-hidden border-slate-200 dark:border-white/10 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg ${selectedLive?.id === live.id ? 'ring-2 ring-red-500' : ''
                            }`}
                        onClick={() => setSelectedLive(live)}
                    >
                        {/* 썸네일 */}
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                            <img
                                src={live.thumbnailUrl || `https://img.youtube.com/vi/${live.youtubeId}/hqdefault.jpg`}
                                alt={live.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* 라이브 배지 */}
                            {live.isLive && (
                                <div className="absolute top-3 left-3">
                                    <Badge className="bg-red-500 text-white animate-pulse">
                                        🔴 LIVE
                                    </Badge>
                                </div>
                            )}
                            {/* 재생시간 */}
                            {live.duration && (
                                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs rounded">
                                    {live.duration}
                                </div>
                            )}
                        </div>

                        <CardContent className="p-4">
                            <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                {live.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(live.scheduledAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatTime(live.scheduledAt)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* 빈 상태 */}
            {lives.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-xl">예정된 라이브 방송이 없습니다.</p>
                </div>
            )}
        </div>
    )
}
