'use client'

/**
 * Vimeo 임베드 비디오 플레이어 컴포넌트
 * Admin에서 관리하는 Vimeo 영상을 재생합니다.
 */

import { useState } from 'react'

interface VimeoPlayerProps {
    /** Vimeo 비디오 ID 또는 전체 embed URL */
    videoId: string
    /** 진행률 업데이트 콜백 */
    onProgress?: (percent: number) => void
    /** 영상 종료 콜백 */
    onEnded?: () => void
    /** 자동재생 여부 */
    autoplay?: boolean
    /** 추가 CSS 클래스 */
    className?: string
    /** 제목 표시 여부 */
    showTitle?: boolean
}

export function VimeoPlayer({
    videoId,
    onProgress,
    onEnded,
    autoplay = false,
    className = '',
    showTitle = false,
}: VimeoPlayerProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

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

    const vimeoId = extractVideoId(videoId)

    // Vimeo 임베드 URL 생성
    const embedUrl = `https://player.vimeo.com/video/${vimeoId}?${new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        title: showTitle ? '1' : '0',
        byline: '0',
        portrait: '0',
        color: '3b82f6', // blue-500
        dnt: '1', // Do Not Track
    }).toString()}`

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

            {/* Vimeo iframe */}
            <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                onError={() => setHasError(true)}
            />
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
