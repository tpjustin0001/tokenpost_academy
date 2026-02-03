'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { OAUTH_CONFIG, exchangeToken, fetchUserInfo } from '@/lib/auth/oauth'

function CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const processedRef = useRef(false)
    const [status, setStatus] = useState('로그인 처리 중...')

    useEffect(() => {
        if (processedRef.current) return
        processedRef.current = true

        const code = searchParams.get('code')
        const state = searchParams.get('state')

        // 1. Basic Validation
        if (!code) {
            setStatus('인증 코드가 없습니다.')
            setTimeout(() => router.push('/login'), 2000)
            return
        }

        const savedState = sessionStorage.getItem('oauth_state')
        const codeVerifier = sessionStorage.getItem('oauth_code_verifier')

        if (state !== savedState) {
            console.error('State mismatch')
            setStatus('보안 검증 실패 (State mismatch)')
            setTimeout(() => router.push('/login'), 2000)
            return
        }

        if (!codeVerifier) {
            console.error('No code verifier found')
            setStatus('인증 정보를 찾을 수 없습니다.')
            setTimeout(() => router.push('/login'), 2000)
            return
        }

        const processLogin = async () => {
            try {
                setStatus('토큰 교환 중...')
                // 2. Exchange Token (via Proxy)
                const tokenResponse = await exchangeToken(code, codeVerifier)

                if (!tokenResponse.access_token) {
                    throw new Error('No access token received')
                }

                setStatus('사용자 정보 조회 중...')
                // 3. Fetch User Info (via Proxy)
                const userInfo = await fetchUserInfo(tokenResponse.access_token)
                console.log('User Info:', userInfo)

                // 4. Create Session (Server Action via API or specialized logic)
                if (!userInfo.uid || !userInfo.email) {
                    throw new Error(`필수 정보 누락 (UID/Email). 수신된 정보: ${JSON.stringify(userInfo)}`)
                }

                const loginResponse = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userInfo.uid,
                        email: userInfo.email,
                        name: userInfo.nickname,
                        role: userInfo.grade === 'admin' ? 'admin' : 'user', // Simple role mapping
                        accessToken: tokenResponse.access_token
                    })
                })

                if (!loginResponse.ok) {
                    const errorData = await loginResponse.json().catch(() => ({}))
                    throw new Error(errorData.error || '세션 생성 실패')
                }

                // 5. Cleanup & Redirect
                sessionStorage.removeItem('oauth_state')
                sessionStorage.removeItem('oauth_code_verifier')

                setStatus('로그인 성공! 이동 중...')
                router.push('/') // or previous path
                router.refresh()

            } catch (error) {
                console.error('Login process failed:', error)
                setStatus(`로그인 실패: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
        }

        processLogin()

    }, [searchParams, router])

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <h2 className="text-xl font-semibold mb-2">{status}</h2>
                <p className="text-slate-400 text-sm">잠시만 기다려주세요.</p>
            </div>
        </div>
    )
}

export default function CallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6" />
                    <p className="text-slate-400">로딩 중...</p>
                </div>
            </div>
        }>
            <CallbackContent />
        </Suspense>
    )
}
