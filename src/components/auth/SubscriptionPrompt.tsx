'use client'

/**
 * 멤버십 안내 컴포넌트
 * 비멤버가 프리미엄 강의 시청 시 표시
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface MembershipPromptProps {
    onClose?: () => void
}

export function SubscriptionPrompt({ onClose }: MembershipPromptProps) {
    const handleMembership = () => {
        // 토큰포스트 멤버십 페이지로 이동
        window.open('https://www.tokenpost.kr/membership', '_blank')
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-slate-800 border-slate-700 max-w-lg w-full">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🔒</span>
                    </div>
                    <CardTitle className="text-2xl text-white">
                        멤버십 전용 콘텐츠
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        이 강의는 토큰포스트 멤버십 회원만 시청할 수 있습니다.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3 text-sm text-slate-300">
                        <p className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Academy 모든 프리미엄 강의 무제한
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            토큰포스트 프리미엄 뉴스 & 분석
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            전문가 리서치 리포트
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleMembership}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            size="lg"
                        >
                            멤버십 알아보기 →
                        </Button>
                        {onClose && (
                            <Button
                                onClick={onClose}
                                variant="ghost"
                                className="w-full text-slate-400 hover:text-white"
                            >
                                닫기
                            </Button>
                        )}
                    </div>

                    <p className="text-center text-xs text-slate-500">
                        이미 멤버십 회원이라면{' '}
                        <a href="/login" className="text-blue-400 hover:underline">
                            로그인
                        </a>
                        해주세요.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

/**
 * 비디오 자리표시자 (비멤버용)
 */
export function VideoPlaceholder() {
    return (
        <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex flex-col items-center justify-center">
            <div className="text-6xl mb-4 opacity-50">🎬</div>
            <p className="text-slate-400 text-center">
                멤버십 회원만 시청할 수 있는 콘텐츠입니다.
            </p>
            <a
                href="https://www.tokenpost.kr/membership"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4"
            >
                <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
                    멤버십 알아보기
                </Button>
            </a>
        </div>
    )
}
