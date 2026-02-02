'use client'

/**
 * OAuth 콜백 페이지
 * 토큰포스트에서 리다이렉트되어 인증 코드를 처리합니다.
 */

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { exchangeToken } from '@/lib/auth/oauth'
import { loginWithTokenPost } from '@/actions/auth'

function CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // URL에서 인증 코드와 상태 추출
                const code = searchParams.get('code')
                const state = searchParams.get('state')
                const error = searchParams.get('error')

                if (error) {
                    throw new Error(`OAuth error: ${error}`)
                }

                if (!code || !state) {
                    throw new Error('Missing code or state parameter')
                }

                // 세션 스토리지에서 저장된 상태 확인 (CSRF 방지)
                const savedState = sessionStorage.getItem('oauth_state')
                const codeVerifier = sessionStorage.getItem('oauth_code_verifier')

                if (!savedState || state !== savedState) {
                    throw new Error('Invalid state parameter (possible CSRF attack)')
                }

                if (!codeVerifier) {
                    throw new Error('Missing code verifier')
                }

                // 토큰 교환
                const tokenResponse = await exchangeToken(code, codeVerifier)

                // Server Action으로 로그인 처리 (세션 생성 및 DB 동기화)
                const result = await loginWithTokenPost(tokenResponse.access_token)

                if (!result.success) {
                    throw new Error(result.error || 'Server login failed')
                }

                // 세션 스토리지 정리
                sessionStorage.removeItem('oauth_state')
                sessionStorage.removeItem('oauth_code_verifier')

                // 로컬 스토리지에 토큰 저장 (클라이언트 사이드 사용 용도)
                localStorage.setItem('access_token', tokenResponse.access_token)
                if (tokenResponse.refresh_token) {
                    localStorage.setItem('refresh_token', tokenResponse.refresh_token)
                }

                setStatus('success')

                // 대시보드로 리다이렉트
                setTimeout(() => {
                    router.push('/dashboard')
                    // router.refresh() // 세션 쿠키 반영을 위해 리프레시 필요
                }, 1000)

            } catch (error) {
                console.error('Callback error:', error)
                setStatus('error')
                setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
            }
        }

        handleCallback()
    }, [searchParams, router])

    return (
        <div className="text-center space-y-4">
            {status === 'loading' && (
                <>
                    <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <h2 className="text-xl font-semibold text-white">로그인 처리 중...</h2>
                    <p className="text-slate-400">잠시만 기다려주세요.</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white">로그인 성공!</h2>
                    <p className="text-slate-400">대시보드로 이동합니다...</p>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white">로그인 실패</h2>
                    <p className="text-red-400">{errorMessage}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-4 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                    >
                        다시 시도
                    </button>
                </>
            )}
        </div>
    )
}

function LoadingFallback() {
    return (
        <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-xl font-semibold text-white">로딩 중...</h2>
        </div>
    )
}

export default function CallbackPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Suspense fallback={<LoadingFallback />}>
                <CallbackContent />
            </Suspense>
        </div>
    )
}
