'use client'

/**
 * 구독 안내 컴포넌트
 * 비구독자가 영상 시청 시 표시
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SubscriptionPromptProps {
    onClose?: () => void
}

export function SubscriptionPrompt({ onClose }: SubscriptionPromptProps) {
    const handleSubscribe = () => {
        // 토큰포스트 구독 페이지로 이동
        window.open('https://www.tokenpost.kr/subscribe', '_blank')
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-slate-800 border-slate-700 max-w-lg w-full">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🔒</span>
                    </div>
                    <CardTitle className="text-2xl text-white">
                        구독자 전용 콘텐츠
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        이 강의는 토큰포스트 구독자만 시청할 수 있습니다.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3 text-sm text-slate-300">
                        <p className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            모든 프리미엄 강의 무제한 시청
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            최신 Web3 트렌드 뉴스레터
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            전문가 리서치 리포트 제공
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            커뮤니티 전용 콘텐츠 접근
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleSubscribe}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            size="lg"
                        >
                            토큰포스트 구독하기
                        </Button>
                        {onClose && (
                            <Button
                                onClick={onClose}
                                variant="ghost"
                                className="w-full text-slate-400 hover:text-white"
                            >
                                나중에 할게요
                            </Button>
                        )}
                    </div>

                    <p className="text-center text-xs text-slate-500">
                        이미 구독자라면{' '}
                        <a href="/login" className="text-blue-400 hover:underline">
                            다시 로그인
                        </a>
                        해주세요.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

/**
 * 비디오 자리표시자 (비구독자용)
 */
export function VideoPlaceholder() {
    return (
        <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex flex-col items-center justify-center">
            <div className="text-6xl mb-4 opacity-50">🎬</div>
            <p className="text-slate-400 text-center">
                구독자만 시청할 수 있는 콘텐츠입니다.
            </p>
        </div>
    )
}
