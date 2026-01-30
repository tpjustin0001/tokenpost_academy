'use client'

/**
 * 로그인 버튼 컴포넌트
 * TokenPost OAuth 로그인을 시작합니다.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { buildAuthorizationUrl } from '@/lib/auth/oauth'

interface LoginButtonProps {
    className?: string
    children?: React.ReactNode
}

export function LoginButton({ className, children }: LoginButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        setIsLoading(true)

        try {
            // PKCE 파라미터 생성 및 로그인 URL 빌드
            const { url, state, codeVerifier } = await buildAuthorizationUrl()

            // 세션 스토리지에 PKCE 파라미터 저장 (콜백에서 사용)
            sessionStorage.setItem('oauth_state', state)
            sessionStorage.setItem('oauth_code_verifier', codeVerifier)

            // 토큰포스트 로그인 페이지로 리다이렉트
            window.location.href = url
        } catch (error) {
            console.error('Login error:', error)
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleLogin}
            disabled={isLoading}
            className={className}
            size="lg"
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    로그인 중...
                </span>
            ) : (
                children || '토큰포스트로 로그인'
            )}
        </Button>
    )
}
