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
import { getLives, type Live } from '@/actions/lives'

type SortOrder = 'newest' | 'oldest'

export function LiveList() {
    const [lives, setLives] = useState<Live[]>([])
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
    const [selectedLive, setSelectedLive] = useState<Live | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch lives from DB
    useEffect(() => {
        async function fetchLives() {
            setIsLoading(true)
            const data = await getLives()
            setLives(data)

            // Select first live or live one
            if (data.length > 0) {
                const liveOne = data.find(l => l.is_live) || data[0]
                setSelectedLive(liveOne)
            }
            setIsLoading(false)
        }
        fetchLives()
    }, [])

    // Sort when order changes
    const sortedLives = [...lives].sort((a, b) => {
        const dateA = new Date(a.scheduled_at).getTime()
        const dateB = new Date(b.scheduled_at).getTime()
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* 메인 플레이어 */}
            {selectedLive && (
                <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedLive.youtube_id}?autoplay=0&rel=0`}
                            title={selectedLive.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            {selectedLive.is_live && (
                                <Badge className="bg-red-500 text-white animate-pulse">
                                    🔴 LIVE
                                </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                                {formatDate(selectedLive.scheduled_at)}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">{selectedLive.title}</h2>
                        {selectedLive.description && (
                            <p className="text-muted-foreground">{selectedLive.description}</p>
                        )}
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
            {sortedLives.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-xl">예정된 라이브 방송이 없습니다.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedLives.map((live) => (
                        <Card
                            key={live.id}
                            className={`group cursor-pointer overflow-hidden border-slate-200 dark:border-white/10 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg ${selectedLive?.id === live.id ? 'ring-2 ring-red-500' : ''
                                }`}
                            onClick={() => setSelectedLive(live)}
                        >
                            {/* 썸네일 */}
                            <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                <img
                                    src={live.thumbnail_url || `https://img.youtube.com/vi/${live.youtube_id}/hqdefault.jpg`}
                                    alt={live.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* 라이브 배지 */}
                                {live.is_live && (
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
                                        {formatDate(live.scheduled_at)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatTime(live.scheduled_at)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
