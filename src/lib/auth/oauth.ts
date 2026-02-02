/**
 * TokenPost OAuth 2.0 + PKCE Configuration
 * login_logic_spec.md 문서 기반 구현
 */

// OAuth 설정
export const OAUTH_CONFIG = {
    // 토큰포스트 OAuth 서버
    AUTH_URL: 'https://www.tokenpost.kr/oauth/v1/authorize',
    TOKEN_URL: '/api/oauth/token', // 프록시 엔드포인트
    USER_INFO_URL: '/api/oauth/userinfo', // 프록시 엔드포인트

    // 클라이언트 설정
    CLIENT_ID: process.env.NEXT_PUBLIC_TP_CLIENT_ID!,
    REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/callback',

    // OAuth Scopes
    SCOPE: 'email nickname grade uid point.tpc subscription',
    USER_INFO_SCOPE: 'user.email,user.nickname,subscription,grade,point.tpc',
}

/**
 * PKCE Code Verifier 생성 (43-128자 랜덤 문자열)
 */
export function generateCodeVerifier(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return base64UrlEncode(array)
}

/**
 * PKCE Code Challenge 생성 (SHA-256 해시)
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(verifier)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return base64UrlEncode(new Uint8Array(hash))
}

/**
 * State 파라미터 생성 (CSRF 방지)
 */
export function generateState(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return base64UrlEncode(array)
}

/**
 * Base64 URL-safe 인코딩
 */
function base64UrlEncode(buffer: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...buffer))
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
}

/**
 * 로그인 URL 생성
 */
export async function buildAuthorizationUrl(): Promise<{
    url: string
    state: string
    codeVerifier: string
}> {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: OAUTH_CONFIG.CLIENT_ID,
        redirect_uri: OAUTH_CONFIG.REDIRECT_URI,
        scope: OAUTH_CONFIG.SCOPE,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    })

    return {
        url: `${OAUTH_CONFIG.AUTH_URL}?${params.toString()}`,
        state,
        codeVerifier,
    }
}

/**
 * 토큰 교환 요청
 */
export async function exchangeToken(
    code: string,
    codeVerifier: string
): Promise<{
    access_token: string
    refresh_token?: string
    expires_in: number
}> {
    const response = await fetch(OAUTH_CONFIG.TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code,
            code_verifier: codeVerifier,
            client_id: OAUTH_CONFIG.CLIENT_ID,
            redirect_uri: OAUTH_CONFIG.REDIRECT_URI,
            grant_type: 'authorization_code',
        }),
    })

    if (!response.ok) {
        throw new Error('Token exchange failed')
    }

    return response.json()
}

/**
 * 사용자 정보 조회
 */
export async function fetchUserInfo(accessToken: string): Promise<{
    email: string
    nickname: string
    uid: string
    grade?: string
    point?: any // 상세 구조는 서버 응답에 따름
}> {
    const response = await fetch(
        `${OAUTH_CONFIG.USER_INFO_URL}?scope=${OAUTH_CONFIG.USER_INFO_SCOPE}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Failed to fetch user info')
    }

    return response.json()
}
