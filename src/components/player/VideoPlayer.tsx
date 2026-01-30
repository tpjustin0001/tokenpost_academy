'use client'

/**
 * Cloudflare Stream 비디오 플레이어 컴포넌트
 * Signed Token을 사용한 보안 영상 재생
 */

import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
    token: string
    streamUrl?: string
    onTimeUpdate?: (currentTime: number, duration: number) => void
    onEnded?: () => void
    onError?: (error: string) => void
    autoplay?: boolean
    className?: string
}

export function VideoPlayer({
    token,
    streamUrl,
    onTimeUpdate,
    onEnded,
    onError,
    autoplay = false,
    className = '',
}: VideoPlayerProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    // Cloudflare Stream 임베드 URL 생성
    const embedUrl = streamUrl
        ? streamUrl.replace('/manifest/video.m3u8', '')
        : `https://iframe.cloudflarestream.com/${token}`

    const fullEmbedUrl = `${embedUrl}?${new URLSearchParams({
        autoplay: autoplay ? 'true' : 'false',
        preload: 'auto',
        letterboxColor: '0f172a', // slate-900
        primaryColor: '3b82f6', // blue-500
    }).toString()}`

    useEffect(() => {
        // Stream Player API 이벤트 리스너
        const handleMessage = (event: MessageEvent) => {
            if (!event.data) return

            try {
                const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data

                switch (data.type) {
                    case 'timeupdate':
                        onTimeUpdate?.(data.currentTime, data.duration)
                        break
                    case 'ended':
                        onEnded?.()
                        break
                    case 'error':
                        setHasError(true)
                        onError?.(data.message || 'Video playback error')
                        break
                    case 'play':
                    case 'loadeddata':
                        setIsLoading(false)
                        break
                }
            } catch {
                // 다른 소스의 메시지 무시
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [onTimeUpdate, onEnded, onError])

    // 로딩 타임아웃
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isLoading) {
                setIsLoading(false)
            }
        }, 5000)

        return () => clearTimeout(timeout)
    }, [isLoading])

    if (hasError) {
        return (
            <div className={`aspect-video bg-slate-900 rounded-lg flex flex-col items-center justify-center ${className}`}>
                <div className="text-red-400 text-xl mb-2">⚠️</div>
                <p className="text-slate-400">영상을 불러올 수 없습니다.</p>
                <button
                    onClick={() => {
                        setHasError(false)
                        setIsLoading(true)
                    }}
                    className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
                >
                    다시 시도
                </button>
            </div>
        )
    }

    return (
        <div className={`relative aspect-video bg-slate-900 rounded-lg overflow-hidden ${className}`}>
            {/* 로딩 스피너 */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Cloudflare Stream iframe */}
            <iframe
                ref={iframeRef}
                src={fullEmbedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
            />
        </div>
    )
}
