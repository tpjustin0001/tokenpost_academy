'use client'

/**
 * Vimeo 임베드 비디오 플레이어 컴포넌트
 * Admin에서 관리하는 Vimeo 영상을 재생합니다.
 */

import { useState, useRef, useEffect } from 'react'
// import Player from '@vimeo/player' // Removed static import
import { cn } from '@/lib/utils' // Assuming cn utility is available

interface VimeoPlayerProps {
    /** Vimeo 비디오 ID 또는 전체 embed URL */
    videoId?: string | null
    /** Vimeo embed URL (SDK 대신 iframe 직접 사용) */
    embedUrl?: string | null
    /** 진행률 업데이트 콜백 (0-100) */
    onProgress?: (percent: number, seconds: number, duration: number) => void
    /** 영상 종료 콜백 */
    onEnded?: () => void
    /** 자동재생 여부 */
    autoplay?: boolean
    /** 추가 CSS 클래스 */
    className?: string
    /** 제목 표시 여부 (SDK 사용 시에만 적용) */
    showTitle?: boolean
}

export function VimeoPlayer({
    videoId,
    embedUrl,
    onProgress,
    onEnded,
    autoplay = false,
    className = '',
    showTitle = false,
}: VimeoPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const playerRef = useRef<any>(null) // Changed to any to avoid type dependency
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    // embedUrl이 있으면 iframe을 직접 렌더링하기 위해 별도 처리
    const isEmbed = !!embedUrl

    // Vimeo 비디오 ID 추출 (URL이든 ID든 처리)
    const extractVideoId = (input: string): string => {
        // 전체 URL인 경우: https://vimeo.com/123456789 또는 https://player.vimeo.com/video/123456789
        const urlMatch = input.match(/vimeo\.com\/(?:video\/)?(\d+)/)
        if (urlMatch) return urlMatch[1]
        // 순수 숫자 ID인 경우
        if (/^\d+$/.test(input)) return input
        // 그 외에는 그대로 반환
        return input
    }

    const vimeoId = videoId ? extractVideoId(videoId) : null

    useEffect(() => {
        if (isEmbed) {
            // Embed URL 사용 시 SDK 초기화 건너뜀
            // iframe의 onLoad에서 isLoading을 false로 설정
            return
        }

        if (!containerRef.current || !vimeoId) {
            // SDK를 사용해야 하는데 videoId가 없으면 에러 처리
            setHasError(true)
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setHasError(false)

        let player: any = null

        const initPlayer = async () => {
            try {
                // Dynamically import the Vimeo Player SDK
                const { default: VimeoPlayerSDK } = await import('@vimeo/player')

                if (!containerRef.current) return

                player = new VimeoPlayerSDK(containerRef.current, {
                    id: Number(vimeoId),
                    autoplay,
                    title: showTitle,
                    responsive: true
                })

                playerRef.current = player

                await player.ready()
                setIsLoading(false)

                player.on('timeupdate', (data: { percent: number; seconds: number; duration: number }) => {
                    onProgress?.(data.percent * 100, data.seconds, data.duration)
                })

                player.on('ended', () => {
                    onEnded?.()
                })

                // 오토플레이 실패 시 음소거로 재시도 로직 등은 SDK 내부 정책 따름
            } catch (error) {
                console.error('Vimeo Player Init Error:', error)
                setHasError(true)
                setIsLoading(false)
            }
        }

        initPlayer()

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy()
                playerRef.current = null
            }
        }
    }, [vimeoId, autoplay, showTitle, isEmbed]) // autoplay, showTitle 등이 바뀌면 리마운트 필요할 수도 있음, 일단 ID 변경 시에만

    // URL이나 ID가 없는 경우
    if (!vimeoId && !embedUrl) {
        return <VideoPlaceholder />
    }

    return (
        <div className={cn("relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg", className)}>
            {/* 로딩 인디케이터 */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                    <div className="w-8 h-8 border-4 border-slate-600 border-t-white rounded-full animate-spin" />
                </div>
            )}

            {/* 에러 메시지 */}
            {hasError && !isEmbed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 text-white">
                    <p className="text-lg font-medium mb-2">동영상을 재생할 수 없습니다</p>
                    <p className="text-sm text-slate-400">잠시 후 다시 시도해주세요</p>
                    <button
                        onClick={() => {
                            setHasError(false)
                            setIsLoading(true)
                            // Force re-render logic if needed
                            window.location.reload() // Simple fallback, or state refresh
                        }}
                        className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
                    >
                        새로고침
                    </button>
                </div>
            )}

            {isEmbed ? (
                <iframe
                    src={embedUrl || ''}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setIsLoading(false)}
                />
            ) : (
                <div ref={containerRef} className="w-full h-full" />
            )}
        </div>
    )
}

/**
 * 플레이스홀더 - 영상이 없는 경우 표시
 */
export function VideoPlaceholder({ className = '' }: { className?: string }) {
    return (
        <div className={`aspect-video bg-slate-800 rounded-lg flex flex-col items-center justify-center ${className}`}>
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <p className="text-slate-400 text-sm">영상이 준비 중입니다</p>
        </div>
    )
}
